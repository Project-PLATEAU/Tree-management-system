const DialogSummaryTableKobokuColumnDef = (options) => [
  {
    headerName: "路線番号",
    width: 90,
    children: [{ headerName: "", field: "rosen_no", width: 90 }],
  },
  {
    headerName: "路線名",
    children: [{ headerName: "", field: "rosen_name", width: 60 }],
  },
  {
    headerName: "樹種",
    children: [{ headerName: "", field: "name" }],
  },
  {
    headerName: "29cm以下",
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
    headerName: "30〜59cm",
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
    headerName: "60〜89cm",
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
    headerName: "90〜119cm",
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
    headerName: "120〜149cm",
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
    headerName: "150〜179cm",
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
    headerName: "180〜209cm",
    children: [
      {
        headerName: "G",
        field: "rank_g",
        aggFunc: "sum",
        width: 100,
      },
    ],
  },
  {
    headerName: "210〜239cm",
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
    headerName: "240〜269cm",
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
    headerName: "270〜299cm",
    children: [
      {
        headerName: "J",
        field: "rank_j",
        aggFunc: "sum",
        width: 110,
      },
    ],
  },
  {
    headerName: "300cm以上",
    children: [
      {
        headerName: "K",
        field: "rank_k",
        aggFunc: "sum",
        width: 100,
      },
    ],
  },
  {
    headerName: "路線合計",
    children: [
      {
        headerName: "",
        field: "rosen_sum",
        aggFunc: "sum",
        width: 90,
      },
    ],
  },
]

export default DialogSummaryTableKobokuColumnDef
