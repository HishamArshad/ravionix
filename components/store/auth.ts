import { observable } from "@legendapp/state"
import { syncObservable } from "@legendapp/state/sync"
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage"


export const authState = observable({ 
  token: null,
  isAuthenticated: false,
  user: null
})

export const humanizerResponse = observable({
  responce: null
})
export const humanizerHistory = observable({
  responce: null
})
export const humanizerDraft = observable({
  text: "",
});

export const summarizerHistory = observable({
  response: []
});
export const mcqHistory = observable({
  response: []
});

export const currentMCQRetake = observable<any>(null);

export const assignmentHistory = observable<any[]>([]);
syncObservable(authState, {
persist:{
  name: 'persistenceExample',
  plugin: ObservablePersistLocalStorage,
}
})
