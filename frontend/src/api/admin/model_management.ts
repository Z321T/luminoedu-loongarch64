import api from '../../utils/http'



export function downloadModelApi() {
  return api({
    url: '/admin/model_management/download_model',
    method: 'POST',
  })
}

export function getModelStatusApi() {
    return api({
        url: '/admin/model_management/model_status',
        method: 'GET',
    })
}

export function deleteModelApi() {
    return api({
        url: '/admin/model_management/local_model',
        method: 'DELETE',
    })
}

