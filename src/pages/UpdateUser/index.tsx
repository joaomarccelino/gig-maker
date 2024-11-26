import Header from '../../components/Header';
import { AiOutlineCamera } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import Select from 'react-select';
import './style.css';
import { brDistricts, instruments } from '../../utils/commonData';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ChangeEvent, useEffect, useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { dataURLtoFile } from '../../utils/dataURLtoFile';
import { useNavigate, useParams } from 'react-router-dom';
import { handleGetUser, handleUserUpdate } from '../../services/user';
import { Instrument, useAuth } from '../../hook/AuthContext';
import InputMask from 'react-input-mask';
import { useQuery } from 'react-query';

type UpdateUserInputs = {
  name: string;
  district: string;
  city: string;
  refsPlaylist: string;
  instruments: Instrument[];
  about: string;
  phone: string;
};

const UpdateUser = () => {
  const { id } = useParams();
  const [profPic, setProfPic] = useState<File | null>(null);
  const [profPicURL, setProfPicURL] = useState<string | null>(null);
  const [showWebCam, setShowWebCam] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const options = instruments.map((i) => {
    return {
      value: i,
      label: i,
    };
  });

  const { isLoading, error, data: userDataBase } = useQuery(
    ['gigmaker-user-data', id],
    () => handleGetUser(id || '').then((res) => res),
    {
      enabled: !!id,
    }
  );

  const { register, handleSubmit, watch, formState: { errors }, reset, control } = useForm<UpdateUserInputs>({
    defaultValues: {
      name: userDataBase?.name || '',
      district: userDataBase?.district || '',
      city: userDataBase?.city || '',
      refsPlaylist: userDataBase?.spotRef || '',
      instruments: userDataBase?.instruments || [],
      about: userDataBase?.about || '',
      phone: userDataBase?.phone || '',
    },
  });

  const saveImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfPic(e.target.files[0]);
      setProfPicURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const webcamRef = useRef<any>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const image = dataURLtoFile(imageSrc, "profile.jpg");
    setProfPic(image);
    setProfPicURL(imageSrc);
  }, [webcamRef]);

  const onSubmit: SubmitHandler<UpdateUserInputs> = async (data) => {
    const phoneWithoutMask = data.phone.replace(/[^0-9]/g, '');
    if (id && profPic) {
      const updatedData = {
        name: data.name,
        district: data.district,
        city: data.city,
        spotRef: data.refsPlaylist,
        instruments: data.instruments,
        about: data.about,
        phone: phoneWithoutMask,
      };

      try {
        await handleUserUpdate(id, updatedData, profPic);
        navigate('/home');
      } catch (error) {
        console.error("Erro ao atualizar os dados:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        district: user.district,
        city: user.city,
        refsPlaylist: user.spotRef,
        instruments: user.instruments,
        about: user.about,
        phone: user.phone,
      });
      setProfPicURL(user.profilePic);
    }
  }, [user, reset]);

  const videoConstraints = {
    width: 360,
    height: 360,
    facingMode: "user",
  };

  return (
    <>
      <Header userId={user?.id || ''} />
      <main className="container register">
        <h1 className="register-title">Atualize suas informações</h1>

        <div className="profile-pic-area" style={{ backgroundImage: `url(${profPicURL})`, backgroundRepeat: "no-repeat", backgroundPosition: "center center", objectFit: "contain", backgroundSize: "cover" }}>
        </div>

        <div className="profile-pic-btns">
          <div className="profile-pic-btn">
            <AiOutlineCamera size={35} color="var(--p2)" onClick={() => {
              if (showWebCam) {
                capture();
                setShowWebCam(false);
              } else {
                setShowWebCam(true);
              }
            }} />
            <p>Tirar foto</p>
          </div>
          <div className="profile-pic-btn">
            <label htmlFor="imageInput" className="image-input-label">
              <BiImageAdd size={35} color="var(--p2)" />
              <input type="file" accept="image/png, image/jpg, image/jpeg" id="imageInput" onChange={saveImage} />
              {profPic ? <p id="imageName">{profPic.name}</p> : <p>Escolher arquivo</p>}
            </label>
          </div>
        </div>

        {showWebCam && (
          <Webcam
            audio={false}
            ref={webcamRef}
            height={360}
            screenshotFormat="image/jpeg"
            width={360}
            videoConstraints={videoConstraints}
          />
        )}

        <h2 className="register-subtitle">Foto de perfil</h2>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="register-form-item">
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" {...register("name", { required: "Campo obrigatório" })} />
          </div>
          <div className="register-form-item">
            <label htmlFor="district">Estado</label>
            <select id="district" {...register("district", { required: "Campo obrigatório" })}>
              <option value="DEFAULT" disabled hidden>Escolha um estado</option>
              {brDistricts.map((d) => {
                return <option key={d.uf} value={d.uf}>{d.name}</option>;
              })}
            </select>
          </div>

          <div className="register-form-item">
            <label htmlFor="city">Cidade</label>
            <input type="text" id="city" {...register("city", { required: "Campo obrigatório" })} />
          </div>

          <div className="register-form-item">
            <label htmlFor="refs-playlist">Playlist de referência Spotify</label>
            <input
              type="text"
              id="refs-playlist"
              {...register("refsPlaylist", { required: true, pattern: /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]{22}(?:\?.*)?$/ })}
            />
            {errors.refsPlaylist && <span className="form-error">Playlist inválida</span>}
          </div>

          <div className="register-form-item">
            <label htmlFor="instruments">Instrumentos que você toca</label>
            <Controller
              control={control}
              name="instruments"
              render={({ field: { onChange, value } }) => (
                <Select
                  options={options}
                  value={options.find((o, index) => o.value === `${value}.${index}`)}
                  onChange={onChange}
                  isMulti
                  className='basic-multi-select'
                  classNamePrefix='select'
                />
              )}
            />
          </div>

          <div className="register-form-item">
            <label htmlFor="phone">Whatsapp</label>
            <Controller
              control={control}
              name="phone"
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <InputMask
                  mask="(99) 99999-9999"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>

          <div className="register-form-item">
            <label htmlFor="about-you">Fale um pouco sobre você</label>
            <textarea
              id="about-you"
              cols={30}
              rows={10}
              {...register("about", { required: "Campo obrigatório" })}
            />
          </div>

          <div className="center-btn">
            <button type="submit" className="register-btn">Atualizar</button>
          </div>
        </form>
      </main>
    </>
  );
};

export default UpdateUser;
