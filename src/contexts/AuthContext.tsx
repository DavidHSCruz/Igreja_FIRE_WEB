import { useEffect, ReactNode } from "react";
import { useAppDispatch } from "../store/hooks";
import { hydrateAuthFromStorage } from "../store/slices/authSlice";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuthFromStorage());
  }, [dispatch]);

  return <>{children}</>;
};
