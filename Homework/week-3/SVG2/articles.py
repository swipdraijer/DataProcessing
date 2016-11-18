'''
# Name: Swip Draijer
# Student number: 10192239
# Loads World Bank data from csv into JSON file
'''

import csv
import json

csvfilename = 'articles.csv'
jsonfilename = csvfilename.split('.')[0] + '.json'
csvfile = open(csvfilename, 'r')
jsonfile = open(jsonfilename, 'w')


fieldnames = ('country', 'articles')
reader = csv.DictReader( csvfile, fieldnames)

out = "[\n\t" + ",\n\t".join([json.dumps(row) for row in reader]) + "\n]"

jsonfile.write(out)

# csvfile.close()
# jsonfile.close()
