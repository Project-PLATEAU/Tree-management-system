const DialogSummaryTableChutebokuColumnDef = (options) => [
  {
    headerName: "路線番号",
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
    children: [{ headerName: "A", field: "rank_a", aggFunc: "sum", width: 90 }],
  },
  {
    headerName: "30〜99cm",
    children: [
      { headerName: "B", field: "rank_b", aggFunc: "sum", width: 100 },
    ],
  },
  {
    headerName: "100〜199cm",
    children: [
      { headerName: "C", field: "rank_c", aggFunc: "sum", width: 110 },
    ],
  },
  {
    headerName: "200〜299cm",
    children: [
      { headerName: "D", field: "rank_d", aggFunc: "sum", width: 110 },
    ],
  },
  {
    headerName: "路線計",
    children: [
      { headerName: "", field: "rosen_sum", aggFunc: "sum", width: 90 },
    ],
  },
]

export default DialogSummaryTableChutebokuColumnDef
