import exception from './pt-BR/exception';
import globalHeader from './pt-BR/globalHeader';
import login from './pt-BR/login';
import menu from './pt-BR/menu';
import settingDrawer from './pt-BR/settingDrawer';
import settings from './pt-BR/settings';
import pwa from './pt-BR/pwa';
import component from './pt-BR/component';

export default {
  'navBar.lang': 'Idiomas',
  'layout.user.link.help': 'ajuda',
  'layout.user.link.privacy': 'política de privacidade',
  'layout.user.link.terms': 'termos de serviços',
  'app.home.introduce': 'introduzir',
  'app.forms.basic.title': 'Basic form',
  'app.forms.basic.description':
    'Páginas de formulário são usadas para coletar e verificar as informações dos usuários e formulários básicos são comuns nos cenários onde existem alguns formatos de informações.',
  ...exception,
  ...globalHeader,
  ...login,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
