import Header from '../../components/Header';
import { AiOutlineCamera } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import Select from 'react-select';
import './style.css';
import { brDistricts, instruments } from '../../utils/commonData';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { dataURLtoFile } from '../../utils/dataURLtoFile';
import { useNavigate, useParams } from 'react-router-dom';
import { handleUserRegister } from '../../services/user';
import { Instrument } from '../../hook/AuthContext';
import InputMask from 'react-input-mask';


type RegisterInputs = {
  name: string;
  district: string;
  city: string;
  refsPlaylist: string;
  instruments: Instrument[];
  about: string;
  phone: string;
}

const Register = () => {
  const playlistRegex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]{22}(?:\?.*)?$/;
  const { id } = useParams();
  const [cep, setCep] = useState<string>('');
  const [city, setCity] = useState('');
  const [profPic, setProfPic] = useState<File>()
  const [imgSrc, setImgSrc] = useState<any>(null);
  const [showWebCam, setShowWebCam] = useState<boolean>(false);
  const [profPicURL, setProfPicURL] = useState<string>();
  const [profPicName, setProfPicName] = useState<string>();
  const navigate = useNavigate();
  const handleSearchCity = async () => {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok && !data.erro) {
        setCity(data.localidade);
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  const options = instruments.map((i) => {
    return {
      value: i,
      label: i
    }
  });

  function saveImage(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setProfPic(e.target.files[0])
      setProfPicName(e.target.files[0].name);
      setProfPicURL(URL.createObjectURL(e.target.files[0]))
    }
  }

  const webcamRef = useRef<any>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const image = dataURLtoFile(imageSrc, "profile.jpg");
    setProfPic(image);
    setProfPicName(image.name);
    setProfPicURL(imageSrc);
  }, [webcamRef, setImgSrc]);

  const { register, handleSubmit, watch, formState: { errors }, reset, unregister, control } = useForm<RegisterInputs>();

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    const phoneWithoutMask = data.phone.replace(/[^0-9]/g, '');
    if (id && profPic) {
      const userData = {
        id: id,
        name: data.name,
        profilePic: '',
        coverPic: '',
        userThumb: '',
        district: data.district,
        city: data.city,
        spotRef: data.refsPlaylist,
        instruments: data.instruments,
        about: data.about,
        type: 'user',
        phone: phoneWithoutMask
      }
      const registerData = {
        id, data: userData, image: profPic
      }
      handleUserRegister(registerData).then(() => navigate('/home'));
    }
  }

  const videoConstraints = {
    width: 360,
    height: 360,
    facingMode: "user"
  };

  return (
    <>
      <Header />
      <main className='container register'>
        <h1 className='register-title'>Antes de começar, preencha algumas informações</h1>

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
            <label htmlFor='imageInput' className='image-input-label'>
              <BiImageAdd size={35} color="var(--p2)" />
              <input type="file" accept="image/png, image/jpg, image/jpeg" id="imageInput" onChange={saveImage} />
              {
                profPic ? <p id="imageName">{profPicName}</p> : <p>Escolher arquivo</p>
              }
            </label>
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
          <div className='register-form-item'>
            <label htmlFor="name" >Nome</label>
            <input type="text" id="name" {...register("name", { required: "Campo obrigatório" })} />
          </div>
          <div className='register-form-item'>
            <label htmlFor="district">Estado</label>
            <select id="district" {...register("district", { required: "Campo obrigatório" })} defaultValue={'DEFAULT'}  >
              <option value="DEFAULT" disabled hidden>Escolha um estado</option>
              {
                brDistricts.map((d) => {
                  return (
                    <option key={d.uf} value={d.uf}>{d.name}</option>
                  )
                })
              }
            </select>
          </div>
          <div className="cep">
            <div>
              <label htmlFor="city" >CEP</label>
              <InputMask
                mask="99999-999"
                onChange={(e) => setCep(e.target.value)}
              />
            </div>
            <button className="cep-btn" onClick={handleSearchCity}>Pesquisar</button>
          </div>
          <div className='register-form-item'>
            <label htmlFor="city">Cidade</label>
            <input type="text" id="city" {...register("city", { required: "Campo obrigatório" })} defaultValue={city} />
          </div>
          <div className='register-form-item'>
            <label htmlFor="refs-playlist">Playlist de referência Spotify</label>
            <input
              type="text"
              id="refs-playlist"
              {...register("refsPlaylist", {
                required: true,
                pattern: playlistRegex
              })}
            />
            {errors.refsPlaylist && <span className='form-error'>Playlist inválida</span>}
          </div>
          <div className='register-form-item'>
            <label htmlFor="instruments">Instrumentos que você toca</label>
            <Controller
              control={control}
              name={'instruments'}
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
          <div className='register-form-item'>
            <label htmlFor="about-you">Fale um pouco sobre você</label>
            <textarea id="about-you" cols={30} rows={10} {...register("about", { required: "Campo obrigatório" })} />
          </div>
          <div className="center-btn">
            <button type='submit' className='register-btn' >Enviar</button>
          </div>
        </form>

      </main>
    </>

  )
}

export default Register;