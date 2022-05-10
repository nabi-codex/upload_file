export default function ({$axios, redirect, app}) {
  $axios.onRequest(config => {

    // let token = app.$cookies.get('token');
    // if (token) token = token.token
    // else token = ""
    //console.log("start axios.js")

    //config.headers.common['Authorization'] = `test token from axios.js`;
    config.headers = {
      //  'x-auth-token': token,
    }
  });

  $axios.onError(error => {
    //console.log("error from2 " + app.$cookies.get('token').token)
    /*
    console.log("error from2 " + error)
    * const code = parseInt(error.response && error.response.status);
    if (code === 400 || code === 500)
        redirect(`/${code}`)
    * */
  });
}
//https://stackoverflow.com/questions/62007932/how-to-set-global-axios-header-in-nuxtjs
