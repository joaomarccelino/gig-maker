import BandMemberInstrument from '../BandMemberInstrument';
import './style.css';

type BandMemberProps = {
  memberPicture: string;
  memberId: string;
  name: string;
  instruments: string[];
}

const BandMember = ({name, instruments, memberPicture}: BandMemberProps) => {
  return (
    <div className='band-member'>
      <img src={memberPicture} alt={name} />
      <span>{name}</span>
      <div className="member-instruments">
        {instruments.map((i) => {
          return (
            <BandMemberInstrument instrument={i} />
          )
        })}
      </div>
    </div>
  )
}

export default BandMember;