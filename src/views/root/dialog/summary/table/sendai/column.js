const DialogSummaryTableSendaiColumnDef = (options) => [
  {
    headerName: "樹種",
    children: [{ headerName: "", field: "tree_name" }],
  },
  {
    headerName: "59cm以下",
    children: [
      {
        headerName: "A",
        field: "rank_a",
        aggFunc: "sum",
        width: 90,
      },
    ],
  },
  {
    headerName: "60〜89cm",
    children: [
      {
        headerName: "B",
        field: "rank_b",
        aggFunc: "sum",
        width: 100,
      },
    ],
  },
  {
    headerName: "90〜119cm",
    children: [
      {
        headerName: "C",
        field: "rank_c",
        aggFunc: "sum",
        width: 100,
      },
    ],
  },
  {
    headerName: "120〜149cm",
    children: [
      {
        headerName: "D",
        field: "rank_d",
        aggFunc: "sum",
        width: 100,
      },
    ],
  },
  {
    headerName: "150〜179cm",
    children: [
      {
        headerName: "E",
        field: "rank_e",
        aggFunc: "sum",
        width: 100,
      },
    ],
  },
  {
    headerName: "180〜209cm",
    children: [
      {
        headerName: "F",
        field: "rank_f",
        aggFunc: "sum",
        width: 100,
      },
    ],
  },
  {
    headerName: "210〜239cm",
    children: [
      {
        headerName: "G",
        field: "rank_g",
        aggFunc: "sum",
        width: 110,
      },
    ],
  },
  {
    headerName: "240〜269cm",
    children: [
      {
        headerName: "H",
        field: "rank_h",
        aggFunc: "sum",
        width: 110,
      },
    ],
  },
  {
    headerName: "270〜299cm",
    children: [
      {
        headerName: "I",
        field: "rank_i",
        aggFunc: "sum",
        width: 110,
      },
    ],
  },
  {
    headerName: "300cm以上",
    children: [
      {
        headerName: "J",
        field: "rank_j",
        aggFunc: "sum",
        width: 100,
      },
    ],
  },
  {
    headerName: "合計",
    children: [
      {
        headerName: "",
        field: "sum",
        aggFunc: "sum",
        width: 90,
      },
    ],
  },
]

export default DialogSummaryTableSendaiColumnDef
