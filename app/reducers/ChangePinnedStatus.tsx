export default function changePinnedStatus(state, action) {
    let pinnedItems = state.slice();
    switch (action.type) {
      case 'REMOVE_FROM_PINNED':
        let newPinnedItems = state.filter(table => table !== action.payload.tablename)
        return newPinnedItems;
      case 'ADD_TO_PINNED':
        pinnedItems.push(action.payload.tablename)
        return pinnedItems;
      default:
        throw new Error();
    }
  }