export const updateState = <TState>(
  state: TState,
  ...updates: Partial<TState>[]
): TState => {
  let updatedState = state;
  for (const update of updates) {
    updatedState = Object.assign({}, updatedState, update);
  }
  return updatedState;
};

export const updateSavedFeatureState = <TState>(
  featureName: string,
  state: TState,
  ...updates: Partial<TState>[]
): TState => {
  const updatedState = updateState(state, ...updates);
  localStorage.setItem(featureName, JSON.stringify(updatedState));
  return updatedState;
};

export const getSavedFeatureState = <TState>(featureName: string): TState => {
  const serializedState = localStorage.getItem(featureName);
  return serializedState && (JSON.parse(serializedState) as TState);
};

export const deleteSavedFeatureState = (featureName: string) => {
  localStorage.removeItem(featureName);
};
