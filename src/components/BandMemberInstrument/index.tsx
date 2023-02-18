import './style.css';
type InstrumentProps = {
  instrument: string;
}

const BandMemberInstrument = ({instrument}: InstrumentProps) => {
  return (
    <div className='band-member-instrument'>
      <p>{instrument}</p>
    </div>
  )
}

export default BandMemberInstrument;