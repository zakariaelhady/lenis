import {useState,useEffect} from 'react'
import s from './contact-form.module.scss'
import { Button } from '../button'
import cn from 'clsx'

export const ContactForm = () => {
  const [formStatus, setFormStatus] = useState('Send')
  const onSubmit = (e) => {
    e.preventDefault()
    setFormStatus('Submitting...')
    const { name, email, message } = e.target.elements
    let dataForm = {
      name: name.value,
      email: email.value,
      message: message.value,
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataForm)
  };
    fetch(`${process.env.NEXT_PUBLIC_HOST}/contact-us`,requestOptions)
        .then((res) => {
          if (res.status === 200) {
            setFormStatus("Sent Successfully");
            name.value = ''
            email.value = ''
            message.value = ''
            setTimeout(() => {
                setFormStatus("Send");
              }, 2000)
          }else{
            setFormStatus("Retry");
          }
        })
        .then((data) => {});
  }

  return (
    <div >
      <div className={s.title}>Contact Us</div>
      <form onSubmit={onSubmit} method='POST'>
        <input className={s.input} type="name" name="name" placeholder="Full Name" required />
        <input className={s.input} type="email" name="email" placeholder="Email" required/>
        <textarea className={s.textArea} id="message" placeholder="Message" required />
        <br/>
        <Button
            className={cn(s.cta, s.in)}
            onClick={() => onSubmit }
          >
            {formStatus}
        </Button>
      </form>
    </div>
  );
}

{/* <div className="container mt-5">
      <h2 className="mb-3">React Contact Form Component Example</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input className="form-control" type="text" id="name" required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input className="form-control" type="email" id="email" required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="message">
            Message
          </label>
          <textarea className="form-control" id="message" required />
        </div>
        <button className="btn btn-danger" type="submit">
          {formStatus}
        </button>
      </form>
    </div> */}
