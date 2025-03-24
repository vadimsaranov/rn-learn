import { getUserQuery } from '@database/queries/userQueries';
import { updateUser, userSelector } from '@store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { useCallback, useEffect, useState } from 'react';

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  const getUser = useCallback(async () => {
    try {
      setLoading(true);
      const dbUser = await getUserQuery();
      if (dbUser) {
        dispatch(updateUser(dbUser));
      }
    } catch {
      throw new Error('Get user failed!');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getUser();
  }, [getUser]);
  return { user, userLoading: loading };
};
