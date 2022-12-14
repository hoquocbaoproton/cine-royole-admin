import React, { useEffect, useReducer } from 'react';

import {
  ActionIcon,
  Alert,
  Button,
  Container,
  createStyles,
  Grid,
  Group,
  Loader,
  PasswordInput,
  Radio,
  Space,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';

import { User } from '../../../../app/interface/user/user';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../app/store';
import { postUserData, updateUserData } from '../../slice/usersSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import FormAlert from '../../../../UI/FormAlert';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  inputBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface AlertState {
  isLoading: boolean;
  success: string;
  error: string;
}
interface AlertAction {
  type: string;
  payload?: string;
}

const initialAlertState: AlertState = {
  isLoading: false,
  success: '',
  error: '',
};

const alertReducer = (state: AlertState, { type, payload }: AlertAction) => {
  switch (type) {
    case 'PENDING':
      return {
        ...initialAlertState,
        isLoading: true,
      };
    case 'SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: '',
        success: payload as string,
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        error: payload as string,
        success: '',
      };
    case 'RESET':
      return {
        ...initialAlertState,
      };
    default:
      return state;
  }
};

interface UserFormProps {
  userDetail: User | undefined;
}

const UserForm = ({ userDetail }: UserFormProps) => {
  const [alertState, dispatchAlert] = useReducer(
    alertReducer,
    initialAlertState
  );
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm({
    initialValues: {
      taiKhoan: '',
      hoTen: '',
      email: '',
      soDT: '',
      matKhau: '',
      maLoaiNguoiDung: '',
    },
    validate: (values) => ({
      taiKhoan: values.taiKhoan === '' ? 'Kh??ng ???????c ????? tr???ng' : null,
      hoTen: values.hoTen === '' ? 'Kh??ng ???????c ????? tr???ng' : null,
      email: values.email === '' ? 'Kh??ng ???????c ????? tr???ng' : null,
      soDT: values.soDT === '' ? 'Kh??ng ???????c ????? tr???ng' : null,
      matKhau: values.matKhau === '' ? 'Kh??ng ???????c ????? tr???ng' : null,
      maLoaiNguoiDung:
        values.maLoaiNguoiDung === '' ? 'Kh??ng ???????c ????? tr???ng' : null,
    }),
  });

  const resetFormHandler = () => {
    form.reset();

    dispatchAlert({ type: 'RESET' });
  };

  const submitHandler = async (values: User) => {
    dispatchAlert({ type: 'PENDING' });
    try {
      if (userDetail) {
        const data = await dispatch(updateUserData(values)).unwrap();
        dispatchAlert({
          type: 'SUCCESS',
          payload: 'C???p nh???t ng?????i d??ng th??nh c??ng',
        });

        return data;
      } else {
        const data = await dispatch(postUserData(values)).unwrap();
        dispatchAlert({
          type: 'SUCCESS',
          payload: 'Th??m ng?????i d??ng th??nh c??ng',
        });
        form.reset();
        return data;
      }
    } catch (error) {
      dispatchAlert({ type: 'ERROR', payload: error as string });
    }
  };

  useEffect(() => {
    if (!userDetail) return;
    form.setValues({
      ...userDetail,
    });
  }, [userDetail]);

  return (
    <>
      <Space h={16} />
      <Container
        sx={{
          textAlign: 'left',
        }}
        size={720}
      >
        <form onSubmit={form.onSubmit(submitHandler)}>
          <Grid gutter='xl'>
            <Grid.Col sm={6}>
              <TextInput
                placeholder='Nh???p t??i kho???n'
                label='T??i kho???n'
                disabled={userDetail ? true : false}
                withAsterisk
                {...form.getInputProps('taiKhoan')}
              />
            </Grid.Col>
            <Grid.Col sm={6}>
              <TextInput
                placeholder='Nh???p h??? v?? t??n'
                label='H??? t??n'
                withAsterisk
                {...form.getInputProps('hoTen')}
              />
            </Grid.Col>
            <Grid.Col sm={6}>
              <TextInput
                placeholder='Nh???p email'
                label='Email'
                withAsterisk
                {...form.getInputProps('email')}
              />
            </Grid.Col>
            <Grid.Col sm={6}>
              <PasswordInput
                placeholder='Nh???p m???t kh???u'
                label='M???t kh???u'
                withAsterisk
                {...form.getInputProps('matKhau')}
              />
            </Grid.Col>
            <Grid.Col sm={6}>
              <TextInput
                placeholder='Nh???p s??? ??i???n tho???i'
                label='S??? ??i???n tho???i'
                withAsterisk
                {...form.getInputProps('soDT')}
              />
            </Grid.Col>
            <Grid.Col sm={6}>
              <Radio.Group
                label='Ch???n vai tr??'
                withAsterisk
                {...form.getInputProps('maLoaiNguoiDung')}
              >
                <Radio value='KhachHang' label='Kh??ch h??ng' />
                <Radio value='QuanTri' label='Qu???n tr???' />
              </Radio.Group>
            </Grid.Col>
          </Grid>
          <Space h={32} />
          <Group position='right'>
            <Button onClick={resetFormHandler} variant='light' color='red'>
              X??a t???t c???
            </Button>
            <Button type='submit' loading={alertState.isLoading}>
              {userDetail && 'C???p nh???t'}
              {!userDetail && 'Th??m'}
            </Button>
          </Group>
        </form>
        <Space h={48} />
        <FormAlert alertState={alertState} />
        {/* {alertState.isLoading && (
          <Alert
            icon={<Loader size={24} />}
            title={userDetail ? 'C???p nh???t ng?????i d??ng' : 'Th??m ng?????i d??ng'}
            color='indigo'
          >
            ??ang t???i...
          </Alert>
        )}
        {alertState.error && (
          <Alert
            icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
            title={
              userDetail
                ? 'C???p nh???t ng?????i d??ng th???t b???i'
                : 'Th??m ng?????i d??ng th???t b???i'
            }
            color='red'
          >
            {alertState.error}
          </Alert>
        )}
        {alertState.success && (
          <Alert
            icon={<FontAwesomeIcon icon={faCheckCircle} />}
            title={
              userDetail
                ? 'C???p nh???t ng?????i d??ng th??nh c??ng'
                : 'Th??m ng?????i d??ng th??nh c??ng'
            }
            color='green'
          >
            {alertState.success}
          </Alert>
        )} */}
      </Container>
    </>
  );
};

export default UserForm;
