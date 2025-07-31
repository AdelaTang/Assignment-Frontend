import { Layout } from 'antd';
import type { ReactNode } from 'react';

const { Content } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        {children}
      </Content>
    </Layout>
  );
};

export default AppLayout;