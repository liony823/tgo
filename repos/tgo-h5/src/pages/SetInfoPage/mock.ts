/**
 * mock 退出接口：模拟网络延迟后返回成功。
 */
export const mockLogout = async (): Promise<void> => {
  await new Promise(resolve => {
    setTimeout(resolve, 800);
  });
};
