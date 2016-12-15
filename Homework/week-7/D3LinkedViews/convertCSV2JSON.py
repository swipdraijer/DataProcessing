'''
# Name: Swip Draijer
# Student number: 10192239
# Loads World Bank data from csv into JSON file
'''
import csv
import json

# Opens data file and json file
csvfilename = 'life_expectancy_2.csv'
jsonfilename = csvfilename.split('.')[0] + '.json'
csvfile = open(csvfilename, 'r')
jsonfile = open(jsonfilename, 'w')

# Assigns field names and reads through csv file
fieldnames = ('code', '1960', '1970', '1980', '1990', '2000', '2010')
reader = csv.DictReader( csvfile, fieldnames)

# Writes each row to jsonfile
out = "[\n\t" + ",\n\t".join([json.dumps(row) for row in reader]) + "\n]"
jsonfile.write(out)

csvfile.close()
jsonfile.close()
