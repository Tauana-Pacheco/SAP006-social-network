import profile from './index.js';
import footer from '../../components/footer/index.js';
import { addPost } from '../../components/post/index.js';
import { getUserData, loadRecipe } from '../../services/index.js';

export default () => {
  const myRecipesContainer = document.createElement('div');
  const myRecipesSection = document.createElement('section');
  myRecipesContainer.append(profile());

  const userUid = getUserData().uid;

  loadRecipe(userUid)
    .then((querySnapshot) => {
      querySnapshot.forEach((post) => {
        if (post.data().user_id === userUid) {
          myRecipesSection.append(addPost(post));
        }
      });
      if (myRecipesSection.childElementCount === 0) {
        myRecipesSection.innerHTML = `
          <div id="notice" class="notice">
            <p> Você ainda não publicou nenhuma receita </p>
          </div>
        `;
      }
    })
    .then(() => {
      myRecipesContainer.append(footer());
    });

  myRecipesContainer.append(myRecipesSection);

  return myRecipesContainer;
};
