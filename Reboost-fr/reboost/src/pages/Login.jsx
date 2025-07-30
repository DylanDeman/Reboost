import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuth } from '../contexts/auth';
import Error from '../components/Error';
import Loader from '../components/Loader.jsx';

const Login = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const isLoggedOut = params.get('logout') === 'success';

  const { error, loading, login } = useAuth();
  const navigate = useNavigate();

  const methods = useForm();
  const { handleSubmit, register } = methods;

  const handleLogin = useCallback(
    async ({ naam, wachtwoord }) => {
      const loggedIn = await login(naam, wachtwoord);
      if (loggedIn) {
        localStorage.setItem('loginTime', new Date());
        const params = new URLSearchParams(search);
        navigate(params.get('redirect') || '/', { replace: true });
      }
    },
    [login, navigate, search],
  );

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">

            {/* Logo */}
            <div className="text-center mb-4">
              <img
                src='../../reboost_logo.png'
                alt="Reboost Logo"
                className="img-fluid mb-3"
                style={{ maxWidth: '200px' }}
              />
              <h2 className="h4 fw-normal text-dark mb-0">Welkom terug</h2>
            </div>

            {/* Login Form */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">

                {isLoggedOut && (
                  <div className="alert alert-success border-0 mb-4" role="alert">
                    <small>✓ Je bent succesvol uitgelogd</small>
                  </div>
                )}

                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(handleLogin)}>

                    <div className="mb-4">
                      <label className="form-label fw-semibold mb-2">
                        Naam
                      </label>
                      <input
                        {...register("naam", { required: true })}
                        type="text"
                        placeholder="Voer je naam in"
                        className="form-control form-control-lg bg-light border-0 shadow-sm"
                        data-cy="loginNaam"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold mb-2">
                        Wachtwoord
                      </label>
                      <input
                        {...register("wachtwoord", { required: true })}
                        type="password"
                        placeholder="Voer je wachtwoord in"
                        className="form-control form-control-lg bg-light border-0 shadow-sm"
                        data-cy="loginWachtwoord"
                      />
                    </div>

                    <Error error={error} />

                    <button
                      type="submit"
                      className="btn btn-dark w-100 py-2 fw-medium"
                      disabled={loading}
                      data-cy="loginSubmitButton"
                      style={{
                        backgroundColor: loading ? '#6c757d' : '#212529',
                        borderColor: loading ? '#6c757d' : '#212529'
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
