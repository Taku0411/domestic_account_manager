 #!/bin/bash

# set name of database
DB_FILE="data.sqlite3"



# 預金口座情報テーブル
# 口座ID, 口座種別, 金融機関名
# 口座ID, 日付, 残高
# cash_deposit
# cash_deposit_account(account_id int, account_type text, bank_name text)
# cash_deposit_data(account_id int, date text, balance int);

# 投資テーブル
# 1. 種別ID, 銘柄, 保有金融機関
# 2. 種別ID, 日付, 評価額, 評価損益, 評価損益率
# trust_invest_account(invest_id, invest_name, bank_name);
# trust_invest_data(invest_id int, date text, net_asset_value int, gain_loss int, gain_loss_percentage float):

sqlite3 $DB_FILE <<EOF
create table cash_deposit_account(account_id int, account_type text, bank_name text);
create table cash_deposit_data(account_id int, date text, balance int);

create table trust_invest_account(invest_id, invest_name, bank_name);
create table trust_invest_data(invest_id int, date text, net_asset_value int, gain_loss int, gain_loss_percentage float);
EOF

