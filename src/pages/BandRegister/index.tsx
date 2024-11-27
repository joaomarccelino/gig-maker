import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineCamera } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import Select from 'react-select';
import Header from '../../components/Header';
import { brDistricts, instruments } from '../../utils/commonData';
import './style.css';
import SearchInput from '../../components/SearchInput';
import { handleBandRegister } from '../../services/band';
import { useNavigate } from 'react-router-dom';
import { dataURLtoFile } from '../../utils/dataURLtoFile';
import { useAuth } from '../../hook/AuthContext';
import InputMask from 'react-input-mask';
import Webcam from 'react-webcam';

type instrument = {
  value: string;
  label: string;
}

type Member = {
  id: string;
  name: string;
  instruments: instrument[]
}

type BandRegisterInputs = {
  name: string;
  district: string;
  city: string;
  refsPlaylist: string;
  repPlaylist: string;
  about: string;
  members: Member[];
  phone: string;
}

const BandRegister = () => {
  const [profPic, setProfPic] = useState<File>()
  const [imgSrc, setImgSrc] = useState<any>(null);
  const [showWebCam, setShowWebCam] = useState<boolean>(false);
  const [profPicURL, setProfPicURL] = useState<string>();
  const [profPicName, setProfPicName] = useState<string>();
  const { user } = useAuth();
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
  const [fields, setFields] = useState([0])

  const options = instruments.map((i) => {
    return {
      value: i,
      label: i
    }
  })


  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors }, reset, unregister, control, setValue } = useForm<BandRegisterInputs>()

  function addNewMember() {
    setFields([...fields, fields.length])
  }

  function removeMember(index: number) {
    const newFields = [...fields]
    newFields.splice(index, 1);
    unregister(`members.${index}`, {
      keepValue: false
    });
    setFields(newFields);
  }

  const onSubmit: SubmitHandler<BandRegisterInputs> = async (data) => {
    const phoneWithoutMask = data.phone.replace(/[^0-9]/g, '');
    if (profPic) {
      const membersData = data.members.map((member, index) => {
        return {
          id: member.id,
          instruments: member.instruments
        }
      })

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
        phone: phoneWithoutMask
      }
      const registerData = {
        data: bandData, image: profPic
      }
      handleBandRegister(registerData).then(() => navigate('/minhas-gigs'));
    }

  }

  const videoConstraints = {
    width: 360,
    height: 360,
    facingMode: "user"
  };

  return (
    <>
      <Header userId={user?.id || ''} />
      <main className='container band-register'>
        <h1 className='register-title'>Criar perfil de banda</h1>
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
          <select id="district"  {...register("district", { required: "Campo obrigatório" })}>
            {
              brDistricts.map((d) => {
                return (
                  <option value={d.uf}>{d.name}</option>
                )
              })
            }
          </select>
          <label htmlFor="city">Cidade</label>
          <input type="text" id="city"  {...register("city", { required: "Campo obrigatório" })} />
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
          <input type="text" id="spot-playlist-ref"  {...register("refsPlaylist", { required: "Campo obrigatório" })} />
          <label htmlFor="spot-playlist-rep">Playlist de repertório Spotify</label>
          <input type="text" id="spot-playlist-rep"  {...register("repPlaylist", { required: "Campo obrigatório" })} />
          <label htmlFor="about-you">Sobre a banda</label>
          <textarea id="about-you" cols={30} rows={10}  {...register("about", { required: "Campo obrigatório" })} />
          <h2 className='members-title'>Membros da banda</h2>
          <div className='member-inputs-area'>
            {
              fields.map((field, index) => (
                <div key={field + index} className="member-inputs">
                  <SearchInput
                    type="text"
                    onUserSelect={(selectedUser) => {
                      setValue(`members.${index}.id`, selectedUser.id, { shouldValidate: true });
                      setValue(`members.${index}.name`, selectedUser.name, { shouldValidate: true });
                    }}
                    {...register(`members.${index}.name`, { required: "Campo obrigatório" })}
                  />
                  <label htmlFor={`instruments-${index}`}>Instrumentos</label>
                  <Controller
                    control={control}
                    name={`members.${index}.instruments`}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        options={options}
                        value={value}
                        onChange={onChange}
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    )}
                  />
                  <button
                    className="unregister-btn"
                    onClick={() => removeMember(index)}
                  >
                    Remover membro
                  </button>
                </div>
              ))
            }
          </div>
          <button className="register-btn band-center-btn" onClick={addNewMember}>Adicionar membro</button>
          <div className="band-center-btn">
            <button type='submit' className='register-btn'>Criar banda</button>
          </div>
        </form>

      </main>
    </>
  )
}

export default BandRegister;