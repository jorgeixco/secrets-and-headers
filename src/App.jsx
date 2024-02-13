import { useState } from 'react';
import './App.css';

function App() {
  const [messageButton, setMessageButton] = useState({ secrets: 'Copy', header: 'Copy' });
  const [secrets, setSecrets] = useState('');
  const [header, setHeader] = useState('');
  const [values, setValues] = useState({
    acount: '',
    callback: '',
    // Eliminado el estado de country, ya que se derivará automáticamente
    commerce: '',
    webhook: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    buildMessage();
  };

  const copiarAlPortapapeles = (text, buttonKey) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessageButton(prev => ({ ...prev, [buttonKey]: 'Copied' }));
      setTimeout(() => {
        setMessageButton(prev => ({ ...prev, [buttonKey]: 'Copy' }));
      }, 2000);
    });
  };

  const buildMessage = () => {
    // Extraer el valor de country del nombre de la cuenta
    // Asumiendo que el formato es siempre {3 letras tienda}{pais}{agencia}
    const country = values.acount.length > 3 ? values.acount.substring(3, 5) : '';

    setSecrets(`
${values.acount}:

CALLBACK-URL-${country}-${values.acount}-${values.commerce} = 
${values.callback.trim()}

BACK-PAGE-URL-${country}-${values.acount}-${values.commerce} = 
${values.callback.trim()}

URL-WEBHOOK-${country}-${values.acount}-${values.commerce} = 
${values.webhook.trim()}
    `.trim());
    setHeader(`
"headers":{
  "x-country": "${country.trim()}",
  "x-customerid": "${values.acount.trim()}",
  "x-commerce": "${values.commerce.trim()}",
  "x-api-version": 1,
  "x-channel": "${values.acount.trim().slice(-5)}",
}
  `.trim());
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="ACOUNT">
          <p>ACOUNT</p>
        </label>
        <input type="text" name="acount" placeholder="ACOUNT" onChange={handleChange} required/>
        <label htmlFor="COMMERCE">
          <p>COMMERCE</p>
        </label>
        <input type="text" name="commerce" placeholder="COMMERCE" onChange={handleChange} required/>
        <label htmlFor="CALLBACK">
          <p>CALLBACK</p>
        </label>
        <input type="url" name="callback" placeholder="CALLBACK" onChange={handleChange} />
        <label htmlFor="WEBHOOK">
          <p>WEBHOOK</p>
        </label>
        <input type="URL" name="webhook" placeholder="WEBHOOK" onChange={handleChange} />
        <button type="submit" style={{marginTop:"30px"}}>Submit</button>
      </form>
      <div>
        <div className="copiable-content">
          <pre>{secrets}</pre>
        </div>
        <button onClick={() => copiarAlPortapapeles(secrets, 'secrets')} className="botonCopiar">
          {messageButton.secrets}
        </button>

        <div className="copiable-content" style={{marginTop:"10px"}}>
          <pre>{header}</pre>
        </div>
        <button onClick={() => copiarAlPortapapeles(header, 'header')} className="botonCopiar dos">
          {messageButton.header}
        </button>
      </div>
    </div>
  );
}


export default App;
