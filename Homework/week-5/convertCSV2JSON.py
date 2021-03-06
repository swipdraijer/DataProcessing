'''
# Name: Swip Draijer
# Student number: 10192239
# Loads World Bank data from csv into JSON file
'''
import csv
import json

# Opens data file and json file
csvfilename = '_expectancy.csv'
jsonfilename = csvfilename.split('.')[0] + '.json'
csvfile = open(csvfilename, 'r')
jsonfile = open(jsonfilename, 'w')

# Assigns field names and reads through csv file
fieldnames = ('country', 'code', 'years')
reader = csv.DictReader( csvfile, fieldnames)

# Writes each row to jsonfile
out = "[\n\t" + ",\n\t".join([json.dumps(row) for row in reader]) + "\n]"
jsonfile.write(out)

csvfile.close()
jsonfile.close()
