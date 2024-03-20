# 樹木管理台帳システム<!-- OSSの対象物の名称を記載ください。分かりやすさを重視し、できるだけ日本語で命名ください。英語名称の場合は日本語説明を（）書きで併記ください。 -->

![概要](./img/tutorial_001.png) <!-- OSSの対象物のスクリーンショット（画面表示がない場合にはイメージ画像）を貼り付けください -->

## 1. 概要 <!-- 本リポジトリでOSS化しているソフトウェア・ライブラリについて1文で説明を記載ください -->
本リポジトリでは、Project PLATEAUの令和5年度のユースケース開発業務の一部であるUC23-14「まちづくりのDXの推進に向けたユースケース開発実証業務（市民協働による樹木データベース作成等）」について、その成果物である「樹木管理台帳システム」を公開しています。

「樹木管理台帳システム」は、本ユースケースで開発した市民協働型で都市公園内の樹木に関する情報や写真を登録できるスマートフォン向けアプリを用いて取得した樹木情報を樹木管理に活用するための台帳システムです。台帳システムは、3D都市モデル（LOD2植生モデル）を基礎とした樹木管理用データベースシステムで、周辺の建物モデルなどと合わせて樹木情報を2D/3Dで地図上に表示する機能を併せ持ちます。

## 2. 「まちづくりのDXの推進に向けたユースケース開発実証業務（市民協働による樹木データベース作成等）」について <!-- 「」内にユースケース名称を記載ください。本文は以下のサンプルを参考に記載ください。URLはアクセンチュアにて設定しますので、サンプルそのままでOKです。 -->
「まちづくりのDXの推進に向けたユースケース開発実証業務（市民協働による樹木データベース作成等）」では、市民協働型で都市公園内の樹木に関する情報や写真を登録できるスマートフォン向けアプリを開発しました。その上で、3D都市モデル（LOD2植生モデル）を基礎とした樹木管理用データベースシステム（本システム）を開発し、スマートフォン向けアプリと連携させることで、市民参加によって樹木情報を取得・更新し、樹木管理に役立てることができる仕組みを構築しました。これにより、行政と市民の協働によって都市内の豊富な樹木情報を大規模に取得する手法の確立の可能性を検証しました。
本システムの詳細については[技術検証レポート](https://www.mlit.go.jp/plateau/file/libraries/doc/plateau_tech_doc_0030_ver01.pdf)を参照してください。

## 3. 利用手順 <!-- 下記の通り、GitHub Pagesへリンクを記載ください。URLはアクセンチュアにて設定しますので、サンプルそのままでOKです。 -->
本システムの構築手順及び利用手順については[利用チュートリアル](https://r5-plateau-acn.github.io/SolarPotential/)を参照してください。

## 4. システム概要 <!-- OSS化対象のシステムが有する機能を記載ください。 -->

#### ①2D/3D表示機能
- 公園内の樹木の3DTilesデータセットを地図上に表現します。
- 地図は2Dと3Dで切り替えて表示ができます。3D表示の際には樹種と樹高、枝張りに合わせて生成した樹木モデルが表示されます。

#### ②一覧表示機能
- 樹木の属性情報を一覧表示します。

#### ③検索機能
- 樹木の属性情報の一覧で列ごとに検索（文字型の場合は部分一致、数値型の場合は演算子を用いた指定）します。

#### ④集計機能　
- 樹木管理業務の発注に必要な樹種別の樹高階級ごとの本数を集計します。集計の際には、③検索機能による絞り込み結果を反映することができます。

#### ⑤データ更新機能　
- ②の一覧表示画面で、属性値の編集が行えます。

#### ⑥エクスポート機能
- ②の一覧、③の検索機能で抽出された結果、④の集計結果をそれぞれエクセル形式でエクスポートします。


## 5. 利用技術

| 種別              | 名称   | バージョン | 内容 |
| ----------------- | --------|-------------|-----------------------------|
| 商用ソフトウェア       | [FME Flow](https://safe.com/) | 2023.1 | FME Formで構築した処理フローをサーバーで実行する |
|        | [FME Form](https://safe.com/) | 2023.1 | ファイル変換などの処理およびその自動化を行う |
| 商用クラウドサービス  | [U-Green](https://greeninfrastructure.jp/u-green/) | - | 樹木の炭素吸収量などを配信するクラウドサービス |
|        | [Cesium ion](https://cesium.com/platform/cesium-ion/) | - | 3Dデータの変換と配信のクラウドサービス |
|        | [CARTO](https://carto.com/) | - | GISデータの可視化と配信のクラウドサービス |
|  商用ライブラリ   | [AG Grid](https://ag-grid.com/) | 31.1.1 | JavaScriptで集計、フィルタリング等を行うためのライブラリ |

## 6. 動作環境 <!-- 動作環境についての仕様を記載ください。 -->
| 項目               | 最小動作環境                                                                                                                                                                                                                                                                                                                                    | 推奨動作環境                   | 
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | 
| OS                 | Microsoft Windows 10 以上　または macOS 12 Monterey 以上                                                                                                                                                                                                                                                                                                                  |  同左 | 
| CPU                | Pentium 4 以上                                                                                                                                                                                                                                                                                                                               | 同左              | 
| メモリ             | 8GB以上                                                                                                                                                                                                                                                                                                                                         | 同左                        |                  | 


## 7. 本リポジトリのフォルダ構成 <!-- 本GitHub上のソースファイルの構成を記載ください。 -->
| フォルダ名               | 詳細               | 
| ------------- | ------------ | 
| auth | 認証State                                                                                                                                                                                                                                                                                                                  |  
| component  | 共有コンポーネント                                                                                                                                                                                                                                                                                                                           | 
| hooks  | ブラウザ機能共通コンポーネント                                                                                                                                                                                                                                                                                                                             | 
| manager  | データマネージャ                                                                                                                                                                                                                                                                                                                              | 
| resources/map  | geojson置き場                                                                                                                                                                                                                                                                                                                              | 
| App.css   | アプリ標準スタイル                                                                                                                                                                                                                                                                                                                              | 
| App.js  | アプリコンポーネント                                                                                                                                                                                                                                                                                                                              | 
| index.css  |  初期スタイル                                                                                                                                                                                                                                                                                                                             | 
| index.js  |  初期JS                                                                                                                                                                                                                                                                                                                             | 
| logo.svg  | ロゴファイル                                                                                                                                                                                                                                                                                                                              | 
| master_data.js  | リスト表示用パラメータ                                                                                                                                                                                                                                                                                                                              | 





## 8. ライセンス <!-- 変更せず、そのまま使うこと。 -->

- ソースコード及び関連ドキュメントの著作権は国土交通省に帰属します。
- 本ドキュメントは[Project PLATEAUのサイトポリシー](https://www.mlit.go.jp/plateau/site-policy/)（CCBY4.0及び政府標準利用規約2.0）に従い提供されています。

## 9. 注意事項 <!-- 変更せず、そのまま使うこと。 -->

- 本リポジトリは参考資料として提供しているものです。動作保証は行っていません。
- 本リポジトリについては予告なく変更又は削除をする可能性があります。
- 本リポジトリの利用により生じた損失及び損害等について、国土交通省はいかなる責任も負わないものとします。

## 10. 参考資料 <!-- 技術検証レポートのURLはアクセンチュアにて記載します。 -->
- 技術検証レポート: https://www.mlit.go.jp/plateau/file/libraries/doc/plateau_tech_doc_0030_ver01.pdf
- PLATEAU WebサイトのUse caseページ「樹木管理台帳システム」: https://www.mlit.go.jp/plateau/use-case/uc22-013/
⑫
