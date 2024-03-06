import { First, One, Query, Rows } from "./carto"

export const SheetEditorType = {
  String: "string",
  Number: "number",
  Select: "select",
  Date: "date",
  DateTime: "date_time",
  Check: "check",
}

export const SheetStringData = {
  type: "string",
  editor_type: SheetEditorType.String,
  editable: true,
  format: null,
  onChange: (data, field, value, def) => {
    return { ...data, [field]: value }
  },
  onBlur: (data, field, value, def) => {
    if (def.format && typeof def.format === "function") {
      let val = def.format(value)
      if (val instanceof Promise) {
        return new Promise((resolve, reject) => {
          val
            .then((res) => {
              resolve({ ...data, [field]: res })
            })
            .catch(reject)
        })
      } else {
        return { ...data, [field]: val }
      }
    }
  },
}

export const SheetIntData = {
  type: "int",
  editor_type: SheetEditorType.Number,
  editable: true,
  onChange: (data, field, value, def) => {
    return { ...data, [field]: value }
  },
  onBlur: (data, field, value, def) => {
    return { ...data, [field]: parseInt(value) }
  },
}

export const SheetFloatData = {
  type: "float",
  editor_type: SheetEditorType.Number,
  editable: true,
  fixed: null,
}

export const SheetDateData = {
  type: "date",
  editor_type: SheetEditorType.Date,
  editable: true,
  format: "YYYY-MM-DD",
  onChange: (data, field, value, def) => {
    return { ...data, [field]: value }
  },
}

export const SheetDataTimeData = {
  type: "date_time",
  editor_type: SheetEditorType.DateTime,
  editable: true,
  format: "YYYY-MM-DD HH:mm",
  onChange: (data, field, value, def) => {
    return { ...data, [field]: value }
  },
}

export const SheetCheckData = {
  type: "bool",
  editor_type: SheetEditorType.Check,
  editable: true,
  onChange: (data, field, value, def) => {
    return { ...data, [field]: value }
  },
}

export const SheetNameListData = {
  type: null,
  editor_type: "select",
  editable: true,
  onChange: (data, field, value, def) => {
    console.log(data, field, value, def)
    if (field !== def.sheet.value_col) {
      return { ...data, [def.sheet.value_col]: value?.value, [def.sheet.name_col]: value?.name }
    }
    return { ...data, [field]: value?.value }
  },
  getValues: (def) => {
    return Rows(
      `SELECT ${def.sheet.value_col} AS value, ${def.sheet.name_col} AS name FROM ${process.env.REACT_APP_TABLE_TREE_VIEW} ORDER BY ${def.sheet.name_col}`
    )
  },
}
