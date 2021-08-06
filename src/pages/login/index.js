import { signIn, signInWithGoogle } from '../../services/index.js';

export default () => {
  const loginScreenContainer = document.createElement('div');
  const loginScreenButtons = `
  <div class="body">
  <img class="logo" src="image/logotipo.png">
  
  <form>
    <input type="email" id="input-email" class="signUp-input" placeholder="E-mail">
    <input type="password" id="input-password" class="signUp-input" placeholder="Senha">
    <div id="notice"> </div>

    <button type="button" id="enter-acc"  class="btn-login">Entrar</button>

    <div class="signUp-link">
      <span> Ainda não tem conta? </span> 
      <a href="#signUp"> CADASTRE-SE </a>
    </div>
  </form>

  <div class="divider">
    <hr> 
    <span class="hr-label"> ou entre com </span>
    <button type="button" id="btn-google" class="btn-google"> <span class="google-icon"></span> Google</button>
  </div>
  `;

  loginScreenContainer.innerHTML = loginScreenButtons;

  const btnLogin = loginScreenContainer.querySelector('#enter-acc');
  const btnGoogle = loginScreenContainer.querySelector('#btn-google');
  const notice = loginScreenContainer.querySelector('#notice');

  btnLogin.addEventListener('click', () => {
    const inputEmail = loginScreenContainer.querySelector('#input-email').value;
    const inputPassword = loginScreenContainer.querySelector('#input-password').value;
    if (inputEmail === '' || inputPassword === '') {
      notice.innerHTML = '<span> Preencha todos os campos </span>';
    } else {
      signIn(inputEmail, inputPassword)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          window.location.hash = '#feed';
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          switch (errorCode) {
            case 'auth/invalid-email':
              notice.innerHTML = '<span>Usuário ou email inválido</span>';
              break;
            case 'auth/user-disabled':
              notice.innerHTML = '<span>Usuário desabilitado</span>';
              break;
            case 'auth/user-not-found':
              notice.innerHTML = '<span>Usuário não encontrado</span>';
              break;
            case 'auth/wrong-password':
              notice.innerHTML = '<span>Usuário ou email inválido</span>';
              break;
            default:
              notice.innerHTML = `<span> ${errorMessage} </span>`;
              break;
          }
          throw new Error(errorMessage);
        });
    }
  });

  btnGoogle.addEventListener('click', () => {
    signInWithGoogle.then((result) => {
      const credentials = {
        credecial: result.credential,
        token: result.credential.accessToken,
        user: result.user,
      };
      window.location.hash = '#feed';
      return credentials;
    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (errorCode) {
          case 'auth/credential-already-in-use':
            notice.innerHTML = '<span> Opa, está credencial já está em uso </span>';
            break;
          default:
            notice.innerHTML = `<span> ${errorMessage} </span>`;
        }
        throw new Error(errorMessage);
      });
  });
  return loginScreenContainer;
};
