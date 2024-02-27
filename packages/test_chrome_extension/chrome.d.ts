interface RuntimeAPI {
  onInstalled: unknown;
}

interface DevtoolsAPI {
  panels: {
    create(
      name: string,
      icon: string,
      page_url: string,
      callback: (panel: unknown) => void,
    ): void;

    elements: {
      createSidebarPane(
        name: string,
        callback: (sidebar: unknown) => void,
      ): void;
    };
  };
  inspectedWindow: unknown;
  network: unknown;
}

interface Chrome {
  runtime: RuntimeAPI;
  devtools: DevtoolsAPI;

  action: unknown;

  [api: string]: unknown;
}

declare const chrome: Chrome;
