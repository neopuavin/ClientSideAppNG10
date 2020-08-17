### Description
Base class library of DataTable class
### Classes
- #### TableRowBase
  ##### Properties
  - `isDirty: boolean`
  - `parentTable: any`
  - `isListCurrent: boolean`
  - `memberOfList : any`
  - `isEditing: boolean`
  - `isPending : boolean`
  - `isDeleting: boolean`
  - `isNew: boolean`
  - `isPristine: boolean`
  - `TableObj: any`
  - `keyVal: any`
  - `toSubmit: boolean`
  - `isCurrent: boolean`
  - `noParent: boolean`
  - `noBackup: boolean`
  - `backupData: any`
  - `toPostData: any`
  - `childChanged: boolean`
  - `XTRA: any`
  - `childChanged:boolean`
  - `Tables: any`
  - `Links: Array<any>`
  - `childCount: number`
  - `childFirst: number`

  ##### Methods
  - `SetAsCurrent()`
  - `Post()`
  - `CaptureDataForPosting()`
  - `UnSetRestoreValues()`
  - `ChildTable(childTableCode: string): any`
  - `ChildRow(childTableCode: string, localField?: string, groupId?: number, reset?: boolean): any`
  - `ChildRows(childTableCode?: string, resolve?: Function, reject?: Function): Array<any>`
  - `SetRestoreValues()`
  - `Restore()`
  - `Delete()`
  - `GetLinkedRows(childTableCode: string): Array<any>`
  - `RemoveLinkedRows(childTableCode: string, childId?: number)`
  - `SetNewId()`

  ##### Events
