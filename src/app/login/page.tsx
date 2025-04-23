import LoginForm from '../../components/LoginForm';

// calls upon LoginForm that was created in components
const LoginPage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
       <LoginForm /> 
      
    </div>
    
  )
}

export default LoginPage