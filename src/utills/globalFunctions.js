import moment from 'moment';

export function calculateTime(messageDate) {
  const now = moment();
  const messageTime = moment(messageDate, 'DD-MMM-YYYY h:mm A');
  const duration = moment.duration(now.diff(messageTime));
  const secondsAgo = duration.asSeconds();
  const minutesAgo = duration.asMinutes();
  const hoursAgo = duration.asHours();

  if (secondsAgo < 60) {
    return 'Just now';
  } else if (minutesAgo < 2) {
    return '1 min ago';
  } else if (minutesAgo < 60) {
    return `${Math.floor(minutesAgo)} mins ago`;
  } else if (hoursAgo < 24) {
    return `${Math.floor(hoursAgo)} hours ago`;
  } else if (hoursAgo < 48) {
    return '1 day ago';
  } else if (hoursAgo < 72) {
    return '2 days ago';
  } else {
    return messageTime.format('DD/MMM/YYYY');
  }
}

export const uploadImageToCloudinary = async image => {
  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    type: image.mime,
    name: 'profile-image.jpg',
  });
  formData.append('upload_preset', 'b1f5s93m');

  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dofa5sctg/image/upload',
      {
        method: 'POST',
        body: formData,
      },
    );
    const result = await response.json();
    console.log(result, 'resultresultresult');
    if (result.secure_url) {
      return result.secure_url;
    } else {
      return 'error';
    }
  } catch (error) {
    return 'error';
  }
};
