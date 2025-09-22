import {getDatabase, push, ref, set} from 'firebase/database';
import moment from 'moment';

export const senderMsg = async ({
  msgValue,
  currentUserId,
  guestUserId,
  imagePath,
}) => {
  try {
    const messagesRef = ref(
      getDatabase(),
      `messages/${currentUserId}/${guestUserId}`,
    );
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, {
      sender: currentUserId,
      receiver: guestUserId,
      msg: msgValue,
      isRead: false,
      time: moment(new Date()).format('DD-MMM-YYYY hh:mm A'),
      attachmentUrl: imagePath ? imagePath : '',
    });
  } catch (error) {
    console.log(error, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    return error;
  }
};

export const ReceivedMsg = async ({
  msgValue,
  currentUserId,
  guestUserId,
  imagePath,
}) => {
  try {
    const messagesRef = ref(
      getDatabase(),
      `messages/${guestUserId}/${currentUserId}`,
    );
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, {
      sender: currentUserId,
      receiver: guestUserId,
      msg: msgValue,
      isRead: false,
      time: moment(new Date()).format('DD-MMM-YYYY hh:mm A'),
      attachmentUrl: imagePath ? imagePath : '',
    });
  } catch (error) {
    console.log(error, 'errroorrrrrrrrrrrrr');
    return error;
  }
};
