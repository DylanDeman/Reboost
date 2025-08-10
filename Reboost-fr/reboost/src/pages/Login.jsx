import { useCallback, useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuth } from '../contexts/auth';
import Error from '../components/Error';
import Loader from '../components/Loader.jsx';
import { ThemeContext } from '../contexts/Theme.context.jsx';

const Login = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const isLoggedOut = params.get('logout') === 'success';
  const formRef = useRef(null);

  const { theme, textTheme } = useContext(ThemeContext);
  const { error, loading, login } = useAuth();
  const navigate = useNavigate();
  
  // Custom error state that we control directly
  const [loginError, setLoginError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    naam: false,
    wachtwoord: false
  });

  // Use error from auth context
  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
  }, [error]);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      naam: '',
      wachtwoord: '',
    }
  });
  
  const { 
    register,
    getValues,
    trigger,
    formState: { errors }
  } = methods;
  
  // Handle form submission with custom error handling
  const processLogin = useCallback(async (e) => {
    // Always prevent default form behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Clear previous errors
    setLoginError(null);
    
    // Get form values
    const { naam, wachtwoord } = getValues();
    
    // Validate form fields
    const hasNoErrors = await trigger();
    
    // Update validation state
    setValidationErrors({
      naam: !naam,
      wachtwoord: !wachtwoord
    });
    
    // Don't proceed if validation fails
    if (!hasNoErrors || !naam || !wachtwoord) {
      return false;
    }
    
    try {
      // Call login function and handle result
      const loggedIn = await login(naam, wachtwoord);
      
      if (loggedIn) {
        localStorage.setItem('loginTime', new Date().toString());
        const params = new URLSearchParams(search);
        navigate(params.get('redirect') || '/', { replace: true });
        return true;
      } else {
        // Show error on failed login (even if no error was thrown)
        setLoginError({
          message: 'Ongeldige inloggegevens. Controleer je gebruikersnaam en wachtwoord.'
        });
        return false;
      }
    } catch (err) {
      // This catch block should not execute for auth errors anymore
      console.error('Unexpected login error:', err);
      setLoginError(err);
      return false;
    }
  }, [getValues, trigger, login, navigate, search]);

  return (
    <div className={`min-vh-100 d-flex align-items-center justify-content-center bg-${theme} text-${textTheme}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            {/* Logo */}
            <div className="text-center mb-4">
              <img
                src='/images/reboost_logo.png'
                alt="Reboost Logo"
                className="img-fluid mb-3"
                style={{ maxWidth: '200px' }}
              />
              <h2 className="h4 fw-normal mb-0">Welkom terug</h2>
            </div>

            {/* Login Form */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {isLoggedOut && (
                  <div className="alert alert-success border-0 mb-4" role="alert">
                    <small>✓ Je bent succesvol uitgelogd</small>
                  </div>
                )}

                {/* Display login error message */}
                {(loginError || error) && (
                  <div className="alert alert-danger" data-cy="error">
                    <p className="mb-0">Ongeldige inloggegevens. Controleer je gebruikersnaam en wachtwoord.</p>
                  </div>
                )}

                <FormProvider {...methods}>
                  <form 
                    ref={formRef}
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent default form submission
                      e.stopPropagation();
                      processLogin(e); // Process login manually
                      return false; // Ensure no further propagation
                    }}
                    noValidate 
                    data-cy="login-form"
                  >
                    <div className="mb-4">
                      <label className="form-label fw-semibold mb-2">
                        Naam
                      </label>
                      <input
                        {...register("naam", { 
                          required: "Naam is verplicht" 
                        })}
                        type="text"
                        placeholder="Voer je naam in"
                        className={`form-control form-control-lg bg-light border-0 shadow-sm ${errors.naam || validationErrors.naam ? 'is-invalid' : ''}`}
                        data-cy="loginNaam"
                        onBlur={() => {
                          const value = getValues('naam');
                          setValidationErrors(prev => ({...prev, naam: !value}));
                        }}
                      />
                      {(errors.naam || validationErrors.naam) && (
                        <div className="invalid-feedback" data-cy="naam-error">
                          Naam is verplicht
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold mb-2">
                        Wachtwoord
                      </label>
                      <input
                        {...register("wachtwoord", { 
                          required: "Wachtwoord is verplicht" 
                        })}
                        type="password"
                        placeholder="Voer je wachtwoord in"
                        className={`form-control form-control-lg bg-light border-0 shadow-sm ${errors.wachtwoord || validationErrors.wachtwoord ? 'is-invalid' : ''}`}
                        data-cy="loginWachtwoord"
                        onBlur={() => {
                          const value = getValues('wachtwoord');
                          setValidationErrors(prev => ({...prev, wachtwoord: !value}));
                        }}
                      />
                      {(errors.wachtwoord || validationErrors.wachtwoord) && (
                        <div className="invalid-feedback" data-cy="wachtwoord-error">
                          Wachtwoord is verplicht
                        </div>
                      )}
                    </div>

                    <button
                      type="button" // Using type="button" to fully control submission
                      className="btn btn-dark w-100 py-2 fw-medium"
                      disabled={loading}
                      data-cy="loginSubmitButton"
                      style={{
                        backgroundColor: loading ? '#6c757d' : '#212529',
                        borderColor: loading ? '#6c757d' : '#212529'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        processLogin(e);
                      }}
                    >
                      {loading ? (
                        <span className="d-flex align-items-center justify-content-center">
                          <Loader />
                          <span className="ms-2">Inloggen...</span>
                        </span>
                      ) : (
                        'Inloggen'
                      )}
                    </button>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
