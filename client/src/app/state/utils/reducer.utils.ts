export const updateState = <TState>(
  state: TState,
  ...updates: Partial<TState>[]
): TState => {
  const update = updates.reduce((accumulatedUpdate, nextUpdate) =>
    Object.assign({}, accumulatedUpdate, nextUpdate)
  );
  return Object.assign({}, state, update);
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

export const getSavedFeatureState = <TState>(
  featureName: string
): TState | undefined => {
  const serializedState = localStorage.getItem(featureName);
  return serializedState && (JSON.parse(serializedState) as TState);
};

export const deleteSavedFeatureState = (featureName: string) => {
  localStorage.removeItem(featureName);
};
