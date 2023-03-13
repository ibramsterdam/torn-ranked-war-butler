import * as buttons from "../../components/buttons";
import * as modals from "../../components/modals";

export async function handleComponent(client: any) {
  for (const component of Object.values(buttons)) {
    const { buttons: clientButtons } = client;
    clientButtons.set(component.data.name, component);
  }
  for (const component of Object.values(modals)) {
    const { modals: clientButtons } = client;
    clientButtons.set(component.data.name, component);
  }
  console.log("Components Loaded");
}
