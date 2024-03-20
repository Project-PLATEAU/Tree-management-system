# 環境構築手順書

# 1 本書について

本書では、樹木管理システム（以下「本システム」という。）の利用環境構築手順について記載しています。本システムの構成や仕様の詳細については以下も参考にしてください。

[技術検証レポート](https://www.mlit.go.jp/plateau/file/libraries/doc/plateau_tech_doc_0030_ver01.pdf)

# 2 動作環境

本変換ツールの動作環境は以下のとおりです。

| 項目               | 最小動作環境                                                                                                                                                                                                                                                                                                                                    | 推奨動作環境                   | 
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | 
| 仮想サーバー                 | Amazon EC2 t2.small 以上                                                                                                                                                                                                                                                                                                                  |  同左 | 
  

# 3 事前準備

本システムで利用する下記の商用、オープンソースのソフトウェアおよびデータベースを準備します。

（1）データベースの準備
[こちら](https://github.com/postgres/postgres)を利用してPostgreSQLサーバを起動します。その上で、位置情報を扱うための拡張機能である[PostGIS](https://github.com/postgis/postgis)をインストールします。

（2）ウェブサーバの準備
[こちら](https://httpd.apache.org/)を利用してウェブサーバを起動します。

（3）FME Flowの準備
[こちら](https://safe.com/)を利用してFME Flowを起動します。
尚、FME Flowは、商用のソフトウェアです。業務目的で利用するには、ライセンスの購入が必要です。新規ライセンスの購入については、Pacific Spatial Solutions 株式会社（Safe Software の公式パートナー）にお問い合わせください。

（4）Amazon S3の準備
[こちら](https://aws.amazon.com/jp/s3/)からAmazon S3のアカウントを取得し、本システムで使用するためのバケットを作成します。一つの公園を対象とする場合はstandardで十分ですが、ご利用になるデータサイズに応じたサイズのバケットを選択してください。

（5）CARTOの準備
[こちら](https://carto.com/)からCARTOのアカウントを取得し、本システムで使用するためのアカウントを作成します。新規ライセンスの購入については、Pacific Spatial Solutions 株式会社（CARTODB社の公式パートナー）にお問い合わせください。


# 4 インストール手順
（1）ウェブサーバにコードを配置
[こちら](https://github.com/Project-PLATEAU/Tree-management-system/src/)からコードをダウンロードします。
展開したファイルを 3（2）で準備したウェブサーバのwebrootに配置します。

（2）環境変数の設定
下記の通り、環境変数を設定します。

`REACT_APP_TITLE=<アプリタイトル>
REACT_APP_AGGRID_LICENSE=<AgGridLicenseKey>
REACT_APP_SQL_ENDPOINT=<SQLAPIエンドポイント>
REACT_APP_ENV_ENDPOINT=<ENVエンドポイント>
REACT_APP_INIT_MAP_CENTER_LAT=<地図初期経度>
REACT_APP_INIT_MAP_CENTER_LNG=<地図初期緯度>
REACT_APP_CARTO_SSL=<CARTODBにSSLで接続するか>
REACT_APP_CARTO_USERNAME=<CARTODBのユーザ名>
REACT_APP_CARTO_DOMAIN=<CARTODBのドメイン>
REACT_APP_CARTO_SERVER_URL=<CARTODBのサーバURL>
REACT_APP_CARTO_ENDPOINT=<CARTODB APIエンドポイント>
REACT_APP_CARTO_SQLAPI_PREFIX=<SQLAPI接続子>
REACT_APP_CARTO_API_KEY=<CARTODB ReadのAPIKEY>
REACT_APP_IMAGE_URL=<画像のBASEDURL>
REACT_APP_FRAME_IMAGE_URL=<フレーム画像のBASEURL>
REACT_APP_MAP_LAYER_DOURODAICHO_URL=<背景図レイヤーのURL>
REACT_APP_MAP_LAYER_GAIKU_URL=<街区レイヤーのURL>
REACT_APP_FIREBASE_API_KEY=<FIREBASE情報>
REACT_APP_FIREBASE_AUTH_DOMAIN=<FIREBASE情報>
REACT_APP_FIREBASE_PROJECT_ID=<FIREBASE情報>
REACT_APP_FIREBASE_STORAGE_BUCKET=<FIREBASE情報>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<FIREBASE情報>
REACT_APP_FIREBASE_APP_ID=<FIREBASE情報>
REACT_APP_FIREBASE_MEASUREMENT_ID=<FIREBASE情報>
REACT_APP_TABLE_TREE_MASTER=<樹木マスターテーブル名>
REACT_APP_TABLE_TREE_EDITED=<樹木編集テーブル>
REACT_APP_TABLE_COMMENT=<コメントテーブル>
REACT_APP_TABLE_USER=<ユーザテーブル>
REACT_APP_TABLE_UGREEN=<U-Green様データテーブル>
REACT_APP_TABLE_TREE_VIEW=<樹木ビュー>
REACT_APP_TABLE_COMMENT_VIEW=<コメントビュー>
REACT_APP_TABLE_TREE_CHANGE_VIEW=<変更履歴テーブル>`

