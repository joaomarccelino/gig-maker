import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineCamera } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import Select from 'react-select';
import Header from '../../components/Header';
import { brDistricts, instruments } from '../../utils/commonData';
import './style.css';

type Member = {
  name: string;
  instruments: string[]
}

type BandRegisterInputs = {
  name: string;
  district: string;
  city: string;
  refsPlaylist: string;
  repPlaylist: string;
  about: string;
  members: Member[];
}

const BandRegister = () => {
  const [fields, setFields] = useState([0])

  const options = instruments.map((i) => {
    return {
      value: i,
      label: i
    }
  })


  const { register, handleSubmit, watch, formState: { errors }, reset, unregister, control } = useForm<BandRegisterInputs>()

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
    console.log(data);
  }
  return (
    <>
      <Header />
      <main className='container band-register'>
        <h1 className='register-title'>Criar perfil de banda</h1>
        <div className="profile-pic-area">
          <div className="profile-pic-btns">
            <div className="profile-pic-btn">
              <AiOutlineCamera size={35} />
              <p>Tirar foto</p>
            </div>
            <div className="profile-pic-btn">
              <BiImageAdd size={35} />
              <p>Escolher arquivo</p>
            </div>
          </div>
        </div>
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
          <label htmlFor="spot-playlist-ref">Playlist de referência Spotify</label>
          <input type="text" id="spot-playlist-ref"  {...register("refsPlaylist", { required: "Campo obrigatório" })} />
          <label htmlFor="spot-playlist-rep">Playlist de repertório Spotify</label>
          <input type="text" id="spot-playlist-rep"  {...register("repPlaylist", { required: "Campo obrigatório" })} />
          <label htmlFor="about-you">Sobre a banda</label>
          <textarea id="about-you" cols={30} rows={10}  {...register("about", { required: "Campo obrigatório" })} />
          <h2 className='members-title'>Membros da banda</h2>
          <div>
            {
              fields.map((field, index) => {
                return (
                  <div key={field + index} className="member-inputs">
                    <label htmlFor="member-name">Nome</label>
                    <input type="text" id="member-name" {...register(`members.${index}.name`, { required: "Campo obrigatório" })} />
                    <label htmlFor="instruments">Instrumentos</label>
                    <Controller
                      control={control}
                      name={`members.${index}.instruments`}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          options={options}
                          value={options.find(o => o.value === `${value}.${index}`)}
                          onChange={onChange}
                          isMulti
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      )}
                    />
                    <button className="unregister-btn" onClick={() => removeMember(index)}>Remover membro</button>
                  </div>
                )
              })
            }
          </div>
          <button className="register-btn" onClick={addNewMember}>Adicionar membro</button>

          <div className="center-btn">
            <button type='submit' className='register-btn' >Criar banda</button>
          </div>
        </form>

      </main>
    </>
  )
}

export default BandRegister;