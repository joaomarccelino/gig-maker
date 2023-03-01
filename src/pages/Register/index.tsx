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
type RegisterInputs = {
  name: string;
  district: string;
  city: string;
  refsPlaylist: string;
  instruments: string[];
  about: string;
}

const Register = () => {
  const [profPic, setProfPic] = useState<File>()
  const [imgSrc, setImgSrc] = useState<any>(null);
  const [showWebCam, setShowWebCam] = useState<boolean>(false);
  const [profPicURL, setProfPicURL] = useState<string>();
  const [profPicName, setProfPicName] = useState<string>();
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
    console.log(profPic)
    console.log(data);
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
          <label htmlFor="name" >Nome</label>
          <input type="text" id="name" {...register("name", { required: "Campo obrigatório" })} />
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
          <label htmlFor="city">Cidade</label>
          <input type="text" id="city" {...register("city", { required: "Campo obrigatório" })} />
          <label htmlFor="refs-playlist">Playlist de referência Spotify</label>
          <input type="text" id="refs-playlist" {...register("refsPlaylist", { required: "Campo obrigatório" })} />
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
          <label htmlFor="about-you">Fale um pouco sobre você</label>
          <textarea id="about-you" cols={30} rows={10} {...register("about", { required: "Campo obrigatório" })} />
          <div className="center-btn">
            <button type='submit' className='register-btn' >Enviar</button>
          </div>
        </form>

      </main>
    </>

  )
}

export default Register;