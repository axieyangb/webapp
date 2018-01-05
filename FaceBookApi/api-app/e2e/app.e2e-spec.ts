import { ApiAppPage } from './app.po';

describe('api-app App', () => {
  let page: ApiAppPage;

  beforeEach(() => {
    page = new ApiAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
