import {
  updateUserDisplayName, updateUserLevel, updateUserAuthEmail, getUserData,
}
  from '../../services/index.js';
import profile from './index.js';

export default () => {
  const profileInfoContainer = document.createElement('div');
  profileInfoContainer.append(profile());
  const profileInfoContent = `
          <aside class="editProfileForm">
            <div class="profileChangesDiv">
              <form id="profileChanges">
                <input id="name" placeholder="nome"></input>
                <input id="email" placeholder="email"></input>
                <select id="userLevel" name="level"> 
                <option value="" selected disabled;>Nível de Cozinha:</option>
                <option value="Queima-panela">Queima-panela</option>
                <option value="Cotidiano">Cotidiano</option>
                <option value="Amador(a)">Amador(a)</option>
                <option value="Profissional/Chef">Profissional/Chef</option>
                <option value="Master/Nível vovó">Master/Nível vovó</option>
                </select>
                <div id="notice"></div>
                <button id="saveChanges">Salvar alterações</button>
              </form>
            </div>
          <aside>
  
          `;
  profileInfoContainer.innerHTML += profileInfoContent;

  const inputName = profileInfoContainer.querySelector('#name');
  const inputEmail = profileInfoContainer.querySelector('#email');
  const userLevel = profileInfoContainer.querySelector('#userLevel');
  const notice = profileInfoContainer.querySelector('#notice');
  const btnSaveChanges = profileInfoContainer.querySelector('#saveChanges');
  const userUid = getUserData().uid;
  const form = profileInfoContainer.querySelector('#profileChanges');
  const nameDisplayedOnScreen = profileInfoContainer.querySelector('#nameDisplayedOnScreen');
  const mailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function EditProfileDom() {
    if (inputName.value) {
      updateUserDisplayName(inputName.value)
        .then(localStorage.setItem('displayName', inputName.value))
        .then(nameDisplayedOnScreen.innerHTML = `${getUserData().displayName}`)
        .catch(() => {
          notice.innerHTML = '<p>Não foi possível atualizar o nome</p>';
        });
    }

    if (inputEmail.value) {
      if (mailFormat.test(inputEmail.value) === false) {
        notice.innerHTML = '<p>Digite um email válido</p>';
      } else {
        updateUserAuthEmail(inputEmail.value).catch(() => {
          notice.innerHTML = '<p>Não foi possível atualizar o email, por favor, entre novamente</p>';
        });
      }
    }

    if (userLevel.value) {
      updateUserLevel(userLevel.value, userUid).catch((error) => {
        console.log(error);
        notice.innerHTML = '<p>Não foi possível atualizar o nível de cozinha</p>';
      });
    }
    form.reset();
  }

  btnSaveChanges.addEventListener('click', (e) => {
    e.preventDefault();
    EditProfileDom();
  });

  return profileInfoContainer;
};