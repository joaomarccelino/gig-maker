import './style.css';
type InstrumentProps = {
  instrument: string;
}

const Instrument = ({instrument}: InstrumentProps) => {
  return (
    <div className='instrument'>
      <p>{instrument}</p>
    </div>
  )
}

export default Instrument;