import Api from '@/service/Api'

export default {
  getMoviesList (url) {
    return Api().get(url)
  }
}
