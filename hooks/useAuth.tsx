import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';

import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';

interface IAuth {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  loading: boolean;
}
const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  error: null,
  loading: false,
});

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  // export const AuthProvider: React.FC = (props) => { //이거 되나 해봤는데 안됨
  const [loading, setLoading] = useState(false); //초기에 로딩중이냐(아니다)
  const [user, setUser] = useState<User | null>(null); //uese정보가 들어있냐
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true); //로딩 초기화??
  const router = useRouter();

  //user에 값이 없으면 user값도 비워버리고 login페이지로 리다이렉트 한다.
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Logged in...
          setUser(user);
          setLoading(false);
        } else {
          // Not logged in...
          setUser(null);
          setLoading(true);
          router.push('/login');
        }

        setInitialLoading(false);
      }),
    [auth]
  );

  //가입을 하면 setLoading이 참일때 실행하려고  true로 잠시 바꿔준후( 왜 바꾸는지 모르겠음)
  // createUserWithEmailAndPassword(auth, data)값을 받아오고
  // userCredential에 user값을 불러오는데 이건 왜인지 모르겠음
  //어쩄든 완료 후 홈으로 리다이렉트 해준다.
  // 다시 setLoding은 false로 변경하면서 완료한다.
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        router.push('/');
        setLoading(false);
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        router.push('/');
        setLoading(false);
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  };

  const logout = async () => {
    setLoading(true);

    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        error.message;
      })
      .finally(() => setLoading(false));
  };

  const memoedValue = useMemo(
    () => ({ user, signUp, signIn, error, loading, logout }),
    [user, loading, error]
  );
  return (
    <AuthContext.Provider value={memoedValue}>
      {!initialLoading && children}
      {/* 초기 로딩이 없는경우  ui를 차단한다는데 뭔말인가 */}
      {/* {children} 이렇게만 할 때의 차이를 나중에 알아보자*/}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
