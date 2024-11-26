import BandMemberInstrument from '../BandMemberInstrument';
import './style.css';

type instrument = {
  label: string;
  value: string;
}

type BandMemberProps = {
  memberPicture: string;
  memberId: string;
  name: string;
  instruments: instrument[];
}

const BandMember = ({memberId, name, instruments, memberPicture}: BandMemberProps) => {
  return (
    <div className='band-member'>
      <a href={`/user/${memberId}`}><img src={memberPicture} alt={name} /></a>
      <a href={`/user/${memberId}`}>{name}</a>
      <div className="member-instruments">
        {instruments.map((i) => {
          return (
            <BandMemberInstrument instrument={i.label} />
          )
        })}
      </div>
    </div>
  )
}

export default BandMember;