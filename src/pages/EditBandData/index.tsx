import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineCamera } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import Header from '../../components/Header';
import { brDistricts, instruments } from '../../utils/commonData';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { dataURLtoFile } from '../../utils/dataURLtoFile';
import { useAuth } from '../../hook/AuthContext';
import InputMask from 'react-input-mask';
import Webcam from 'react-webcam';
import { handleBandUpdate, handleGetBand } from '../../services/band';
import { useQuery } from 'react-query';

type instrument = {
  value: string;
  label: string;
}

type Member = {
  id: string;
  name: string;
  instruments: instrument[]
}

type BandUpdateInputs = {
  name: string;
  district: string;
  city: string;
  refsPlaylist: string;
  repPlaylist: string;
  about: string;
  members: Member[];
  phone: string;
}

const EditBandData = () => {
  const [profPic, setProfPic] = useState<File>();
  const [showWebCam, setShowWebCam] = useState<boolean>(false);
  const [profPicName, setProfPicName] = useState<string>();
  const { user } = useAuth();
  const { bandId } = useParams();

  const webcamRef = useRef<any>(null);

  const { isLoading, error, data: band } = useQuery(
    ['gigmaker-band-data'],
    () => handleGetBand(bandId || '').then(res => res),
    {
      enabled: !!bandId,
    }
  );
  const [profPicURL, setProfPicURL] = useState<string>(band?.profilePic || '');

  const { register, handleSubmit, watch, formState: { errors }, reset, unregister, control, setValue } = useForm<BandUpdateInputs>();

  const navigate = useNavigate();

  useEffect(() => {
    if (band) {
      reset({
        name: band.name || '',
        district: band.district || '',
        city: band.city || '',
        refsPlaylist: band.refsPlaylist || '',
        repPlaylist: band.repPlaylist || '',
        about: band.about || '',
        members: band.members || [],
        phone: band.phone || '',
      });
    }
  }, [band, reset]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const image = dataURLtoFile(imageSrc, "profile.jpg");
    setProfPic(image);
    setProfPicName(image.name);
    setProfPicURL(imageSrc);
  }, [webcamRef]);

  const [fields, setFields] = useState([0]);

  const options = instruments.map((i) => ({
    value: i,
    label: i
  }));

  function saveImage(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setProfPic(e.target.files[0]);
      setProfPicName(e.target.files[0].name);
      setProfPicURL(URL.createObjectURL(e.target.files[0]));
    }
  }

  const onSubmit: SubmitHandler<BandUpdateInputs> = async (data) => {
    const phoneWithoutMask = data.phone.replace(/[^0-9]/g, '');
    if (profPic) {
      const membersData = data.members.map((member) => ({
        id: member.id,
        instruments: member.instruments,
      }));

      const bandData = {
        owner: user?.id || '',
        name: data.name,
        profilePic: '',
        district: data.district,
        city: data.city,
        refsPlaylist: data.refsPlaylist,
        repPlaylist: data.repPlaylist,
        about: data.about,
        type: 'band',
        members: membersData,
        phone: phoneWithoutMask,
      };

      try {
        await handleBandUpdate(bandId || '', bandData, profPic);
        navigate("/minhas-gigs");
      } catch (error) {
        console.error("Erro ao atualizar os dados:", error);
      }
    }
  };

  const videoConstraints = {
    width: 360,
    height: 360,
    facingMode: "user"
  };

  return (
    <>
      <Header userId={user?.id || ''} />
      <main className='container band-register'>
        <h1 className='register-title'>Atualizar perfil da banda</h1>
        <div className="profile-pic-area" style={{ backgroundImage: `url(${profPicURL})`, backgroundRepeat: "no-repeat", backgroundPosition: "center center", objectFit: "contain", backgroundSize: "cover" }}>
          <div className="profile-pic-btns">
            <div className="profile-pic-btn">
              <AiOutlineCamera size={35} onClick={() => {
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
              <label htmlFor='imageInput' className='image-input-label'>
                <BiImageAdd size={35} color="var(--p2)" />
                <input type="file" accept="image/png, image/jpg, image/jpeg" id="imageInput" onChange={saveImage} />
                {
                  profPic ? <p id="imageName">{profPicName}</p> : <p>Escolher arquivo</p>
                }
              </label>
            </div>
          </div>
        </div>
        {
          showWebCam &&
          <Webcam
            audio={false}
            ref={webcamRef}
            height={360}
            screenshotFormat="image/jpeg"
            width={360}
            videoConstraints={videoConstraints}
          />
        }
        <h2 className="register-subtitle">Foto de perfil</h2>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">Nome</label>
          <input type="text" id="name" {...register("name", { required: "Campo obrigatório" })} />
          <label htmlFor="district">Estado</label>
          <select id="district" {...register("district", { required: "Campo obrigatório" })}>
            {brDistricts.map((d) => (
              <option key={d.uf} value={d.uf}>{d.name}</option>
            ))}
          </select>
          <label htmlFor="city">Cidade</label>
          <input type="text" id="city" {...register("city", { required: "Campo obrigatório" })} />
          <div className='register-form-item'>
            <label htmlFor="phone">Whatsapp</label>
            <Controller
              control={control}
              name="phone"
              defaultValue=''
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
          <label htmlFor="spot-playlist-ref">Playlist de referência Spotify</label>
          <input type="text" id="spot-playlist-ref" {...register("refsPlaylist", { required: "Campo obrigatório" })} />
          <label htmlFor="spot-playlist-rep">Playlist de repertório Spotify</label>
          <input type="text" id="spot-playlist-rep" {...register("repPlaylist", { required: "Campo obrigatório" })} />
          <label htmlFor="about-you">Sobre a banda</label>
          <textarea id="about-you" cols={30} rows={10} {...register("about", { required: "Campo obrigatório" })} />
          <button type="submit" className="sign-btn">Atualizar</button>
        </form>
      </main>
    </>
  );
};

export default EditBandData;
