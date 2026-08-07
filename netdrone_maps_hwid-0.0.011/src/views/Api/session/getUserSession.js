import { MessageProcessor } from '@adc/vigour-ui/lib/spl'

export async function getSessionData(splURL) {
  return new Promise((resolve, reject) => {
    var sessionData = {
      app_name: '',
      module_name: '',
      page_name: ''
    }

    var subString, arrayStr

    if (splURL.includes('/spl2/')) {
      subString = splURL.substr(splURL.indexOf('/spl2/'))
      arrayStr = subString.split('/')
      if (arrayStr.length > 0) {
        sessionData.app_name = arrayStr[2]
        sessionData.module_name = arrayStr[2]
        sessionData.page_name = arrayStr[3]
      }
    } else if (splURL.includes('/spl/')) {
      subString = splURL.substr(splURL.indexOf('/spl/') + 5, splURL.indexOf('.spl'))
      arrayStr = subString.split('/')
      if (arrayStr.length > 0) {
        sessionData.app_name = arrayStr[0]
        sessionData.module_name = arrayStr[0]
        sessionData.page_name = arrayStr[1]
      }
    } else if (splURL.includes('/spl-plus/')) {
      subString = splURL.substr(splURL.indexOf('/spl-plus/'))
      arrayStr = subString.split('/')
      if (arrayStr.length > 0) {
        sessionData.app_name = arrayStr[2]
        sessionData.module_name = arrayStr[3]
        sessionData.page_name = arrayStr[4]
      }
    } else if (splURL.includes('/procodeComp/')) {
      subString = splURL.substr(splURL.indexOf('/procodeComp/'))
      arrayStr = subString.split('/')
      if (arrayStr.length > 0) {
        sessionData.app_name = arrayStr[3]
        sessionData.module_name = arrayStr[4]
        sessionData.page_name = arrayStr.slice(5, 9).join('_')
      }
    }
    resolve(sessionData);
  });
}

// Function to process session data
export function processSessionData(sessionData) {
  MessageProcessor.process({
    serviceId: '/usage_app_log/usage_app_log/usage_app_log_session_create_submit',
    data: sessionData,
    async: false,
    success: function () {
      console.log('========== This session successfully updated')
      console.log('========== App name : ' + sessionData.app_name)
      console.log('========== Module name : ' + sessionData.module_name)
      console.log('========== Page name : ' + sessionData.page_name)
    }
  })
}
