from django.shortcuts import render, get_object_or_404
from .forms import initialForm
#from .models import Post

# for ajax posts
from django.http import HttpResponse

# for http requests
import urllib3
import json

# google sheets
import gspread
from oauth2client.service_account import ServiceAccountCredentials
# update via mass pandas df
from gspread_dataframe import set_with_dataframe, get_as_dataframe

# pandas
import pandas as pd
# For google calendar
import datetime
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# regex
import re

# for file paths
import os
#from django.conf import settings

# inits
http = urllib3.PoolManager()
apikey= 'f60d7f0857a3be54cd7b6427f7e61e9c'
keysfolder = os.path.join(os.path.abspath(os.path.dirname(__file__)),'keys')
googlesheetkeypath = keysfolder+"/tgc-01-bc70985442c3.json"
googlecalendartokenpath = keysfolder+"/tgcCalendarToken.pickle"
# googlesheet inits and functions

## === Functions === ##
def initGS(jsonfile="tgc-01-bc70985442c3.json"):
    scope = ['https://spreadsheets.google.com/feeds',
             'https://www.googleapis.com/auth/drive']
    gs_credentials = ServiceAccountCredentials.from_json_keyfile_name(jsonfile,scope)
    gc = gspread.authorize(gs_credentials)
    return gc

# google calendar init
def initGC():
	if os.path.exists(googlecalendartokenpath):
		with open(googlecalendartokenpath, 'rb') as token:
			creds = pickle.load(token)
		service = build('calendar', 'v3', credentials=creds)
		return service
	else:
		print("google calendar token pickle missing.")
		return "google calendar token pickle missing."


#print(settings.BASE_DIR + "/keys/tgc-01-bc70985442c3.json")
print(keysfolder)

gc = initGS(jsonfile=googlesheetkeypath)
wos = gc.open("Wedding Order Sheet")

def logtosheet(sheetname):
	global gc
	global wos
	try:
		sheet = wos.worksheet(sheetname)
		return sheet
	except:
		gc = initGS(jsonfile=googlesheetkeypath)
		wos = gc.open("Wedding Order Sheet")
		sheet = wos.worksheet(sheetname)
		return sheet
	#finally:
	#	print('Cannot Login to Google Sheet Name')
	#	return None

def dealwithresponsedata(responsedata):

	eventdate1 = responsedata.get('eventdate1')
	eventdate2 = responsedata.get('eventdate2')
	eventdate3 = responsedata.get('eventdate3')

	if (eventdate1 != "") and eventdate1 is not None:
		eventdate1 = datetime.datetime.strptime(eventdate1,'%d-%m-%Y').strftime('%d %b %y')
	if (eventdate2 != "") and eventdate2 is not None:
		eventdate2 = datetime.datetime.strptime(eventdate2,'%d-%m-%Y').strftime('%d %b %y')
	if (eventdate3 != "") and eventdate3 is not None:
		eventdate3 = datetime.datetime.strptime(eventdate3,'%d-%m-%Y').strftime('%d %b %y')

	response_data = {
			'bridename' : responsedata.get('bridename'),
			'groomname' : responsedata.get('groomname'),
			'phonenum' : responsedata.get('phonenum'),
			'emailfield' : responsedata.get('emailfield',""),#.lower(), # lowercase all
			'howdidyouhear' : responsedata.get('howdidyouhear'),
			#'eventdate1' : responsedata.get('eventdate1'),
			'eventdate1' :  eventdate1,
			'eventtype1' : responsedata.get('eventtype1'),
			'eventvenue1' : responsedata.get('eventvenue1'),
			#'eventdate2' : responsedata.get('eventdate2'),
			'eventdate2' :  eventdate2,
			'eventtype2' : responsedata.get('eventtype2'),
			'eventvenue2' : responsedata.get('eventvenue2'),
			#'eventdate3' : responsedata.get('eventdate3'),
			'eventdate3' :  eventdate3,
			'eventtype3' : responsedata.get('eventtype3'),
			'eventvenue3' : responsedata.get('eventvenue3'),
			'requiredoutfit' : responsedata.get('requiredoutfit').replace("false,","").replace("false",""),
			'noofgowns' : responsedata.get('noofgowns'),
			'preferredoutfit' : responsedata.get('preferredoutfit').replace("false,","").replace("false",""),
			'preferredoutOthers' : responsedata.get('preferredoutOthers'),
			'preferredstyle' : responsedata.get('preferredstyle').replace("false,","").replace("false",""),
			'preferredstyleOthers' : responsedata.get('preferredstyleOthers'),
			'preferredNeckline' : responsedata.get('preferredNeckline').replace("false,","").replace("false",""),
			'preferredNeckOthers' : responsedata.get('preferredNeckOthers'),

			'attendant': responsedata.get('attendant'),
			'additionalnotes': responsedata.get('additionalnotes'),

			'cust_id' : responsedata.get('cust_id'),
		}

	return response_data


def updateEventDict(eventdict, response_data, eventnum=1):

	#eventdict = {'weddingdate': None,'PWS': None, 'ROMdate' : None,}

	if response_data.get('eventtype'+eventnum) == "Actual":
		eventdict['weddingdate'] = response_data.get('eventdate'+eventnum)

	if response_data.get('eventtype'+eventnum) == "PWS":
		eventdict['PWS'] = response_data.get('eventdate'+eventnum)

	if response_data.get('eventtype'+eventnum) == "ROM":
		eventdict['ROMdate'] = response_data.get('eventdate'+eventnum)

	return eventdict

# === Tablet Form Functions
def check_email_in_GS_TabletForm(email="", gsht="Tablet Form", emailcolnum=4):
	tabformsht = logtosheet(gsht)
	## === pre-process inputs
	email = str(email).strip()
	if "@" not in email: email = ""

	## === If no input, then return None
	if email=="" or (email is None):
		print("invalid email.")
		return "invalid email"

	## === Search for Email === 
	emailcol = tabformsht.col_values(emailcolnum)
	emailcol = [str(v) for v in emailcol]
	matchingEmailrow = [r for r, s in enumerate(emailcol) if email in s]


	if len(matchingEmailrow)>0:
		print("found matching row in Tablet Form of Google Sheet.")
		return matchingEmailrow[0] + 1

	else:
		print("no matching email in Tablet Form of Google Sheet.")
		return "no matching email"
		
def check_phonenum_in_GS_TabletForm(phonenum="", gsht="Tablet Form", phonenumcolnum=3):
	tabformsht = logtosheet(gsht)
	## === pre-process inputs
	phonenum = str(phonenum).strip()

	print("checking phone number: {}".format(phonenum))
	## === If no input, then return None
	if phonenum=="" or (phonenum is None):
		print("invalid phonenum.")
		return "invalid phonenum"

	## === Search for Email === 
	phonenumcol = tabformsht.col_values(phonenumcolnum)
	phonenumcol = [str(v) for v in phonenumcol]
	matchingPhoneNumrow = [r for r, s in enumerate(phonenumcol) if phonenum in s]


	if len(matchingPhoneNumrow)>0:
		print("found matching row in Tablet Form of Google Sheet.")
		return matchingPhoneNumrow[0] + 1

	else:
		print("no matching phonenum in Tablet Form of Google Sheet.")
		return "no matching phonenum"

def updateGS_TabletForm(datarow=["error"]*4,rowcheckresult="invalid email", gsht="Tablet Form"):
	tabformsht = logtosheet(gsht)
	# if email is invalid, return Invalid Email message in tablet form message
	if rowcheckresult == "invalid email":
		print("return invalid email message")
		message = "Invalid Email address. Tablet Form not updated."

	# if email present in Tablet Form, Update Row and Return Update Message
	elif rowcheckresult != "no matching email":

		for i, d in enumerate(datarow):
			col = i+1
			tabformsht.update_cell(rowcheckresult, col, d)
		print("Updated existing row in Tablet Form DB.")
		message = "Updated existing row in Tablet Form DB."

	else: # if does not match, then insert/create new row
		result = tabformsht.insert_row(datarow, 2)
		print("Inserted New Row in Tablet Form DB Successfully...")
		message = "New data/row created in Tablet Form DB."
	return message


# === Customer Account Functions
def check_EmailorPhone_exists_returnRowNum(email="", phone="", 
	gsht="booqable customer id", emailcolnum=1, phonecolnum=5,):
	
	bqCustIDsht = logtosheet(gsht)
	## === pre-process inputs
	email = str(email).strip()
	if "@" not in email: email = ""
	phone = str(phone).strip()
	if len(phone)<7: phone = ""


	## === If no input, then return None
	if email=="" and phone=="":
		print("invalid email and phone.")
		return "invalid email and phone."

	## === Search for Email ===
	if email!="" and (email is not None):
		print('search email col for emailadd..')
		#get list of values from Email Column
		emailcol = bqCustIDsht.col_values(emailcolnum) #emailcol = 1
		emailcol = [str(v) for v in emailcol] # covert all values to strings
		matchingemailrow = [r for r, s in enumerate(emailcol) if email in s]
		if len(matchingemailrow)>0:
			return matchingemailrow[0] + 1
		else:
			print("no such email exist")

	## === if no such email, search phone number
	if phone!="" and (phone is not None):
		#get list of values from Phone Column
		print('search phone col for phone num..')
		phonecol = bqCustIDsht.col_values(phonecolnum) #phonecol = 5
		phonecol = [str(v) for v in phonecol] # convert all values to strings
		matchingphonerow = [r for r, s in enumerate(phonecol) if phone in s]
		if len(matchingphonerow)>0:
			return matchingphonerow[0] + 1
		else:
			print("no such phone exist")

	print("no matching email or phone.")
	return "no matching email or phone."


def create_ID_in_booqable(name="blankname", email="", phone=""):
	## === pre-process inputs ===
	email = str(email).strip()
	if "@" not in email: email = ""
	phone = str(phone).strip()
	if len(phone)<7: phone = ""

	## === If no input, then return None
	if email=="" and phone=="":
	    print("Warning: No account created due to missing/invalid email and phone number.")
	    return ("Warning: No account created due to missing/invalid email and phone number.", None)

	else:
		encoded_body = json.dumps({"customer": {
								"name": name,
								"email": email,
								"properties_attributes": [{
										"type":"Property::Phone",
										"name": "Phone",
										"value": phone }],
										}
								})

		r = http.request('POST', 
	                     'https://the-gown-connoisseur.booqable.com/api/1/customers?api_key='+apikey,
	                    headers={'content-type': 'application/json'},
	                    body=encoded_body,
	                    )
		status = r.status

		if str(status)[0] == '2':
			data = r.data
			json_obj = json.loads(data)
			customer_id = json_obj['customer']['id']
			customer_num = json_obj['customer']['number']
			print('Customer: num - {}, id - {} created.'.format(customer_num, customer_id))
			return (customer_id, customer_num)
		else:
			print('failed in customer creation status: {}'.format(status))
			return ('failed in customer creation phase', None)


def searchForCustDetailsInBooqable(custNum="", custID=""):

	## === pre-process inputs ===
	custNum = str(custNum).strip()
	custID = str(custID).strip()

	## === If no input, then return None
	if custNum=="" and custID=="":
		print("Warning: No Cust found due to missing/invalid customer id or num.")
		return ("Warning: No Cust found due to missing/invalid customer id or num.", None, None, None, None)

	# Search Booqable with Cust Number and return GS dataset
	if custNum !="" and (custNum is not None):
		r = http.request('GET','https://the-gown-connoisseur.booqable.com/api/1/customers/'+custNum+'?api_key='+apikey)
		status = r.status
		if str(status)[0] == '2':
			data = r.data
			json_obj = json.loads(data)
			email = json_obj['customer']['email']
			custID = json_obj['customer']['id']
			custname = json_obj['customer']['name']
			custNum = json_obj['customer']['number']
			custhp = ""

			if len(json_obj['customer']['properties'])>0:
				for i in json_obj['customer']['properties']:
					if i['type'] == "Property::Phone":
						custhp = i["value"]

			return (email, custID, custname, custNum, custhp)

		else:
			print('failed to ping booqable on search with Cust Num. Status: {}'.format(status))
			#return ('failed to ping booqable on search with Cust Num.', None, None, None, None)

	if custID !="" and (custID is not None):
		r = http.request('GET','https://the-gown-connoisseur.booqable.com/api/1/customers/'+custID+'?api_key='+apikey)
		status = r.status
		if str(status)[0] == '2':
			data = r.data
			json_obj = json.loads(data)
			email = json_obj['customer']['email']
			custID = json_obj['customer']['id']
			custname = json_obj['customer']['name']
			custNum = json_obj['customer']['number']
			custhp = ""
			# iterate through to find customer phone property
			if json_obj['customer']['properties']:
				for i in json_obj['customer']['properties']:
					if i['type'] == "Property::Phone":
						custhp = i["value"]
			return (email, custID, custname, custNum, custhp)

		else:
			print('failed to ping booqable on search with Cust ID. Status: {}'.format(status))
			#return ('failed to ping booqable on search with Cust ID.',None, None, None, None)

	#else:
	print("Warning: No Cust found due to missing/invalid customer id or num.")
	return ("Warning: No Cust found due to missing/invalid customer id or num.", None, None, None, None)


def searchForCustDetailsInGS(rowNum="", gsht="booqable customer id"):
	bqCustIDsht = logtosheet(gsht)
	details = bqCustIDsht.row_values(rowNum)
	email = details[0]
	custID= details[1]
	name = details[2]
	custNum = details[3]
	phone = details[4]
	return (email, custID, name, custNum, phone)

def insertNewCustID_in_GS(email="", custID="", name="", custNum="", phone="", gsht="booqable customer id",):
	bqCustIDsht = logtosheet(gsht)
	result = bqCustIDsht.insert_row([email, custID, name, custNum, phone],2)
	return result 

def updateGS_CustomerForm(response_data= {},rowcheckresult="invalid email and phone.", gsht="booqable customer id"):
	bqCustIDsht = logtosheet(gsht)
	availcustID = None # to pass to order search

	# if email and phone is invalid, return Invalid Email and Phone message
	if rowcheckresult == "invalid email and phone.":
		print("return invalid email message")
		message = "Invalid Email and Phone. Cannot Initiate Account."
		#return message

	# if available account, Update Row and Return Update Message
	elif rowcheckresult != "no matching email or phone.":
		email, custID, name, custNum, phone = searchForCustDetailsInGS(rowNum=rowcheckresult)
		message = "Customer registered before. Updated record in GS under row {}, Cust Number: #{}, id: {}".format(rowcheckresult, custNum, custID)
		availcustID = custID
		#return message

	else: # if does not match, then insert/create new row
		print('creating new account in booqable...')

		cust_id, cust_num = create_ID_in_booqable(name=response_data['bridename'], 
    												email=response_data['emailfield'], 
    												phone=response_data['phonenum'])
		availcustID = cust_id

		if cust_num is None: # if error
			message = cust_id
			return (message, availcustID)

		print('acct created in booqable')
		# search Booqable for full customer Info
		email, custID, name, custNum, phone = searchForCustDetailsInBooqable(custNum=cust_num, custID=cust_id)
		availcustID = custID
		
		if custID is None: # if error
			message = email
			return (message, availcustID)

		# insert row in GS sheet
		insertNewCustID_in_GS(email=email,custID=custID, name=name, custNum=custNum, phone=phone)
		message = "Customer Acct created in Boooqable under Cust Number: #{}, id: {}".format(custNum, custID)

	return (message, availcustID)


# === Order Functions
def check_OrderNumorOrderID_exists_returnRowNum(custID="", ordernum="", orderID="",
	gsht="booqable orders",custIDcolnum=1,orderIDcolnum=2,ordernumcolnum=3):
	bqCustIDsht = logtosheet(gsht)
	## === pre-process inputs
	custID = str(custID).strip()
	ordernum = str(ordernum).strip()
	orderID = str(orderID).strip()
	message = None

	## === If no input, then return None
	if custID=="" and ordernum=="" and orderID =="":
		print('Returning no order as Cust ID, Order Number, Order ID all missing.')
		message = 'Corrupted Customer ID.'
		return message

	## === Search for Cust ID ===
	if custID!="" and (custID is not None):
		print('searching cust ID col in Orders Sheet..')

		custIDcol = bqCustIDsht.col_values(custIDcolnum)
		custIDcol = [str(v) for v in custIDcol]
		matchingCustIDrow = [r for r, s in enumerate(custIDcol) if custID in s]
		if len(matchingCustIDrow)>0:
			matchingGSrowForCustID = matchingCustIDrow[0] + 1
			message = matchingGSrowForCustID
		else:
			print('no such customer ID exist in Orders Sheet.')
			message = 'no such customer ID exist in GS Orders Sheet.'

	if ordernum!="" and (ordernum is not None):
		print('searching order num col for order num..')
		ordernumcol = bqCustIDsht.col_values(ordernumcolnum)
		ordernumcol = [str(v) for v in ordernumcol]
		matchingordernumrow = [r for r, s in enumerate(ordernumcol) if ordernum in s]
		if len(matchingordernumrow)>0:
			matchingGSrowForOrderNum =  matchingordernumrow[0] + 1
			message = matchingGSrowForOrderNum
		else:
			print('no such order num exist.')
			message = 'No such order num exist GS order sheet.'

	if orderID!="" and (orderID is not None):
		print('searching order ID col for order ID..')
		orderIDcol = bqCustIDsht.col_values(orderIDcolnum)
		orderIDcol = [str(v) for v in orderIDcol]
		matchingorderIDrow = [r for r, s in enumerate(orderIDcol) if orderID in s]
		if len(matchingorderIDrow)>0:
			matchingGSrowForOrderID =  matchingorderIDrow[0] + 1
			message = matchingGSrowForOrderID
		else:
			print('no such order ID exist.')
			message = 'No such order num exist GS order sheet.'

	return message

def get_order_rowvalues_from_GS(orderrownum=2, gsht="booqable orders"):
	ordersht = logtosheet(gsht)

	## === pre-process inputs
	orderdetails = ordersht.row_values(orderrownum)
	custID=orderdetails[0]
	orderID = orderdetails[1]
	ordernum = orderdetails[2]
	orderstatus = orderdetails[3]
	order_order = orderdetails[4]
	order_weddingdate = orderdetails[5]
	order_pwsdate = orderdetails[6]
	order_romdate = orderdetails[7]

	
	message = (custID, orderID, ordernum, orderstatus, order_order, order_weddingdate, 
				order_pwsdate, order_romdate)
	
	#message = tuple(orderdetails)

	return message

def create_Order_in_booqable(custID="", weddingdate="", order_pwsdate="", order_romdate=""):
	custID = str(custID).strip()

	if custID=="":
		print("Warning: No order created due to missing/invalid cust ID.")
		message = "Warning: No order created due to missing/invalid cust ID."
		return (message, None, None, None, None, None, None, None)

	encoded_body = json.dumps({"order": {
								"customer_id": custID,
								"properties_attributes": [{
										'type': 'Property::TextField',
										'name': 'Wedding Date',
										'value': weddingdate, },

										{
										'type': 'Property::TextField',
										'name': 'PWS Date',
										'value': order_pwsdate, },

										{
										'type': 'Property::TextField',
										'name': 'ROM Date',
										'value': order_romdate, },

									],}
								})

	r = http.request('POST','https://the-gown-connoisseur.booqable.com/api/1/orders?api_key='+apikey,
		headers={'content-type': 'application/json'}, body=encoded_body,)
	
	status = r.status

	if str(status)[0] == '2':
		data = r.data
		json_obj = json.loads(data)
		customer_id = json_obj['order']['customer']['id']
		customer_num = json_obj['order']['customer']['number']
		orderID = json_obj['order']['id']
		ordernum = ""
		orderstatus = ""
		orderdetails = ""
		order_weddingdate = ""
		order_pwsdate = ""
		order_romdate = ""

		# iterate through to find order wedding date property
		if len(json_obj['order']['properties'])>0:
			for i in json_obj['order']['properties']:
				if i['name'] == 'Wedding Date':
					order_weddingdate = i['value']
				if i['name'] == 'PWS Date':
					order_pwsdate = i['value']
				if i['name'] == 'ROM Date':
					order_romdate = i['value']

		print('created order id: {} (not saved)'.format(orderID))

		# save order as concept
		r = http.request('POST',
			'https://the-gown-connoisseur.booqable.com/api/1/orders/'+orderID+'/concept'+'?api_key='+apikey,)
		status = r.status
		if str(status)[0] == '2':
			data = r.data
			json_obj = json.loads(data)
			ordernum = json_obj['order']['number']
			orderstatus = json_obj['order']['status']
			print('Order {} saved as concept for: \n Customer: num - {}, id - {}'.format(orderID, customer_num, customer_id))
			return (customer_id, orderID, ordernum, orderstatus, orderdetails, order_weddingdate, order_pwsdate, order_romdate)
		else:
			print('failed in order "Saving" status: {}'.format(status))
			message = 'failed in order "Saving" status: {}'.format(status)
			return (message, None, None, None, None, None, None, None)
	else:
		print('failed in order "Creation" status: {}'.format(status))
		message = 'failed in order "Creation" status: {}'.format(status)
		return (message, None, None, None, None, None, None, None)

def insertNewOrder_in_GS(customer_id="", orderID="", ordernum="", orderstatus="",
	orderdetails="", order_weddingdate="", order_pwsdate="", order_romdate="", 
	gsht="booqable orders",):

	bqOrdersht = logtosheet(gsht)

	eventdate = ""
	if order_weddingdate != "" and order_weddingdate is not None:
		eventdate = order_weddingdate
	elif order_pwsdate != "" and order_pwsdate is not None:
		eventdate = order_pwsdate
	elif order_romdate != "" and order_romdate is not None:
		eventdate = order_romdate
	else:
		eventdate = ""

	result = bqOrdersht.insert_row([customer_id, orderID, int(ordernum), orderstatus, 
	orderdetails, order_weddingdate, order_pwsdate, order_romdate, eventdate], 2)
	return result

def updateOrder_in_GS(ordernum="", orderID="", gsht="booqable orders", orderIDcolnum=2, ordernumcolnum=3):
	## === pre-process inputs
	ordernum = str(ordernum).strip()
	orderID = str(orderID).strip()
	message = None
	### === Retrieve data from Booqable ===
	## === If no input, then return None
	
	if ordernum!="" and (ordernum is not None):
		# get order details in booqable
		r = http.request('GET','https://the-gown-connoisseur.booqable.com/api/1/orders/'+ordernum+'?api_key='+apikey)
		status = r.status
		paraused = 'order number'

	elif orderID!="" and (orderID is not None):
		r = http.request('GET','https://the-gown-connoisseur.booqable.com/api/1/orders/'+orderID+'?api_key='+apikey)
		status = r.status
		paraused = 'order id'

	else:
		print('somehow did not search booqable for order.')
		message = "corrupted order number and order id."
		return (message, None, None, None, None, None, None, None, None)

	if str(status)[0] == '2':
		data = r.data # get json respons
		json_obj = json.loads(data) # parse json response

		custID = json_obj['order']['customer_id']
		ordernum = str(json_obj['order']['number'])
		orderID = json_obj['order']['id']
		status = json_obj['order']['status']

		orderdetails ="" 
		# iterate through to find order details property
		if len(json_obj['order']['lines'])>0:
			for i in json_obj['order']['lines']:
				orderdetails += str(i['title']) + ", "


		order_weddingdate = ""
		order_pwsdate = ""
		order_romdate = ""

		# iterate through to find order wedding date property
		if len(json_obj['order']['properties'])>0:
			for i in json_obj['order']['properties']:
				if i['name'] == 'Wedding Date':
					order_weddingdate = i['value'].replace("(TBC)", "").split("to")[0].strip() # remove TBC
				elif i['name'] == 'PWS Date':
					order_pwsdate = i['value'].replace("(TBC)", "").split("to")[0].strip()
				elif i['name'] == 'ROM Date':
					order_romdate = i['value'].replace("(TBC)", "").split("to")[0].strip()

		eventdate = ""
		if order_weddingdate != "" and order_weddingdate is not None:
			eventdate = order_weddingdate
		elif order_pwsdate != "" and order_pwsdate is not None:
			eventdate = order_pwsdate
		elif order_romdate != "" and order_romdate is not None:
			eventdate = order_romdate
		else:
			eventdate = ""

		gsrowdata = (custID, orderID, ordernum, status, orderdetails, 
			order_weddingdate, order_pwsdate, order_romdate, eventdate)

	else:	# did not find id in booqable
		print('failed to retrieve {} from booqable status: {}'.format(paraused, status))
		message = 'failed to retrieve {} from booqable status: {}'.format(paraused, status)
		return (message, None, None, None, None, None, None, None, None)
	    
	### === update GS ===
	bqOrdersht = logtosheet(gsht)
	print('searching order ID col for order ID..')
	orderIDcol = bqOrdersht.col_values(orderIDcolnum) #phonecol = 5
	orderIDcol = [str(v) for v in orderIDcol] # convert all values to strings
	matchingorderIDrow = [r for r, s in enumerate(orderIDcol) if orderID in s]

	print('searching order num col for order num..')
	ordernumcol = bqOrdersht.col_values(ordernumcolnum) #phonecol = 5
	ordernumcol = [str(v) for v in ordernumcol] # convert all values to strings
	matchingordernumrow = [r for r, s in enumerate(ordernumcol) if ordernum in s]

	if len(matchingorderIDrow)>0:
		matchingrow = matchingorderIDrow[0] + 1
		for i, d in enumerate(gsrowdata):
			col = i+1
			bqOrdersht.update_cell(matchingrow, col, d)
			print('completed GS order update on cell ({}, {}).'.format(matchingrow, col))
		print('order updated on GS.')

		# return row data
		return (custID, orderID, ordernum, status, orderdetails, order_weddingdate, 
			order_pwsdate, order_romdate, matchingrow)

	elif len(matchingordernumrow)>0:
		matchingrow = matchingordernumrow[0] + 1

		for i, d in enumerate(gsrowdata):
			col = i+1
			bqOrdersht.update_cell(matchingrow, col, d)
			print('completed GS order update on cell ({}, {}).'.format(matchingrow, col))
		print('order updated on GS.')

		# return row data
		return (custID, orderID, ordernum, status, orderdetails, 
			order_weddingdate, order_pwsdate, order_romdate, matchingrow)
	
	else: # if no such order exist in order sheet, insert order
		print('no such order ID exist in Order Sheet.')
		print('inserting new order')
		insertNewOrder_in_GS(customer_id=custID, orderID=orderID, ordernum=ordernum, orderstatus=status,
			orderdetails=orderdetails, order_weddingdate=order_weddingdate, 
			order_pwsdate=order_pwsdate, order_romdate=order_romdate)

		message = (custID, orderID, ordernum, status, orderdetails, 
			order_weddingdate, order_pwsdate, order_romdate, 2)
		return message


# === Invoice Functions
def searchInvoicefromBooqable(invoiceNum=""):

	## === pre-process inputs
	invoiceNum = str(invoiceNum).strip()
	message = None
	## === If no input, then return None
	if invoiceNum=="" or (invoiceNum is None):
		print('Returning No Invoice as Invoice Num is Missing.')
		message = 'Returning No Invoice as Invoice Num is Missing.'
		return (message, None, None, None,None,None,None)
	
	else:
		r = http.request('GET','https://the-gown-connoisseur.booqable.com/api/1/invoices/'+invoiceNum+'?api_key='+apikey)
		status = r.status

		# if success
		if str(status)[0] == '2':
			data = r.data
			json_obj = json.loads(data)
			customer_id = json_obj['invoice']['customer_id']
			doc_id = json_obj['invoice']['id']
			name = json_obj['invoice']['name']
			invoicenum = str(json_obj['invoice']['number'])
			orderID = json_obj['invoice']['order_id']
			invoicefullnum = json_obj['invoice']['title']
			doc_type = json_obj['invoice']['type']
			print('Invoice {} found in Booqable'.format(invoiceNum))
			return (customer_id, doc_id, name, invoicenum, orderID, invoicefullnum, doc_type)
	
		else:
			print('failed in Invoice "Search" status: {}'.format(status))
			message = 'failed in Invoice "Search" status: {}'.format(status)
			return (message, None, None, None,None,None,None)

def updateInvoiceInGS(invoiceNum="", gsht="booqable documents", invoicedocIDcolnum=2):
	## === pre-process inputs
	invoiceNum = str(invoiceNum).strip()
	## === If no input, then return None
	if invoiceNum=="" or (invoiceNum is None):
		print('Returning No Invoice as Invoice Num is Missing.')
		message = 'Returning No Invoice as Invoice Num is Corrupted.'
		return (message, None, None, None,None,None,None, None)

	else:
		customer_id, doc_id, name, invoicenum, orderID, \
		invoicefullnum, doc_type = searchInvoicefromBooqable(invoiceNum=invoiceNum)
	    #(customer_id,doc_id,name,invoicenum,orderID, invoicefullnum, doc_type)
		
		if invoicefullnum is None: # if no such invoice in booqable
			print('No such invoice, please create one.')
			message = customer_id
			return (message, None, None, None,None,None,None, None)

		else: # search for row in GS
			invoicesearch_result = [customer_id, doc_id, name, invoicenum, orderID, invoicefullnum, doc_type]
			invoicesearch_result[3] = int(invoicesearch_result[3]) # type integer for invoice num
			# Search for Invoice Doc ID in GS
			bqInvoicesht = logtosheet(gsht)
			print('searching Invoice Doc ID col for Doc ID..')
			invoiceIDcol = bqInvoicesht.col_values(invoicedocIDcolnum) #phonecol = 5
			invoiceIDcol = [str(v) for v in invoiceIDcol] # convert all values to strings
			matchinginvoiceIDrow = [r for r, s in enumerate(invoiceIDcol) if invoicesearch_result[1] in s]

			# if records exist in GS
			if len(matchinginvoiceIDrow)>0:
				matchingrow = matchinginvoiceIDrow[0] + 1

				# update each cell in GS
				for i, d in enumerate(invoicesearch_result):
					col = i+1
					bqInvoicesht.update_cell(matchingrow, col, d)
					print('completed GS order update on cell ({}, {}).'.format(matchingrow, col))

				print('order updated on GS.')
				return (customer_id, doc_id, name, invoicenum, orderID, invoicefullnum, doc_type, matchingrow)
			
			# create new row
			else:
				result = bqInvoicesht.insert_row(invoicesearch_result, 2) # insert in row below headings
				print('created new invoice row in GS for InvoiceNum: {}'.format(invoiceNum))
				return (customer_id, doc_id, name, invoicenum, orderID, invoicefullnum, doc_type, 2)


# === Fitting Time Functions
def getGoogleCalendarDf(service="", calendarId='engmeiting@gmail.com',lookbackdays=30):
	# Inits
	# Set "Now Date to Some Days back from Now"
	now = (datetime.datetime.utcnow() - datetime.timedelta(days=lookbackdays)).isoformat() + 'Z' # 'Z' indicates UTC time

	# Get Stack
	print("Getting {} Calanedar events...".format(calendarId))
	events_result = service.events().list(calendarId=calendarId, timeMin=now,
										#maxResults=10,
										singleEvents=True,
										orderBy='startTime').execute()

	events = events_result.get('items', [])

	# init blank dataframe
	df = pd.DataFrame()
	
	for event in events:
		try:
			start = event['start'].get('dateTime', event['start'].get('date'))
		except:
			start = ""

		try:
			clientemail = event.get("description", "").split('\n')[2].split(':')[1].strip()
		except:
			clientemail = ""
		try:
			clientnumber = event.get("description", "").split('\n')[1].split(':')[1].strip()
		except:
			clientnumber = ""
		try:
			clientname = re.sub("\+\d\w*|\w*\d\w*", "", event.get("summary", "").split('for')[1]).strip()
		except:
			clientname = ""

		try:
			eventname = event.get("summary", "").split('for')[0].strip()
		except:
			eventname = ""

		try:
			staffname = event.get("description", "").split('\n')[0].split(':')[1].strip()
		except:
			staffname = ""
		
		df = df.append(pd.Series([clientemail, clientnumber, clientname, eventname,start,staffname],
				index=['client_email','client_hp','client_name', 'event_name', 'date','staff'],),
				ignore_index=True)
    
	# filter away non-staff entries
	df = df[df["staff"] != ""]

	# set datetime format
	if df.shape[0]>0:
		df['date'] = df['date'].apply(lambda x: x.replace("T"," ").replace("+08:00",""))
		df['date'] = pd.to_datetime(df['date'], format="%Y-%m-%d %H:%M:%S",
							#errors='ignore'
							)
							#.dt.strftime('%Y-%m-%d %H:%M')
	return df

def updateFittingTimes(service="", lookbackdays=30, gsht="wix fitting dates"):
	## === get meiting's df stack first
	df_MTevents = getGoogleCalendarDf(service=service,
		calendarId='engmeiting@gmail.com', lookbackdays=lookbackdays)

	## === get tgc's df stack 'hello@thegownconnoisseur.com'
	df_TGCevents = getGoogleCalendarDf(service=service,
		calendarId='hello@thegownconnoisseur.com', lookbackdays=lookbackdays)

	## === get gs df
	wixfittingsht = logtosheet(gsht)
	gsfittingdatesdf = (get_as_dataframe(wixfittingsht)[['client_email', 'client_hp', 'client_name',
		'date', 'event_name', 'staff']].dropna(axis=0,how='all') )

	# parse date
	gsfittingdatesdf['date'] = pd.to_datetime(gsfittingdatesdf['date'], 
		format="%Y-%m-%d %H:%M", errors='ignore')

	# combine all dfs
	df_events = gsfittingdatesdf.append(df_MTevents, ignore_index=True)
	df_events = df_events.append(df_TGCevents, ignore_index=True)

	# drop duplicate entries
	df_events.drop_duplicates(subset=['client_email','event_name','staff', 'date'], 
		inplace=True)

	# sort values by date
	df_events.sort_values('date', ascending=False, inplace=True)

	# get fitting df only
	df_fittings = df_events[df_events["event_name"].str.contains("Fitting")]

	# get consultations df only
	df_consultations = df_events[df_events["event_name"].str.contains("Consultation")]

	# set df for google sheet (fittings first then consultation)
	df_for_sheet = df_fittings.append(df_consultations, ignore_index=True)

	# replace GS with this new df
	set_with_dataframe(wixfittingsht, df_for_sheet)
	print('GS updated with new results.')

	return "Updated Fitting Dates in GS."

## === Django Views === ##
def initial_formview(request):

	context = {'nothing': 'nothing_yet'}
	# return blank form
	formfields = initialForm()

	return render(request, 'form.html', {'formfields': formfields})


def submitformdetails(request):

	if request.method == 'POST':
		print('submitformdetails view reached..')

		response_data = dealwithresponsedata(request.POST)
		emailaddress = response_data.get('emailfield')
		phone = response_data.get('phonenum')

		# 1. check if record is available in Tablet Form
		gsTablet_EmailrowNum = check_email_in_GS_TabletForm(email=emailaddress)		

		# 2. check if record is available in Customer Google Sheet
		#gsCust_CustIDrowNum = check_EmailorPhone_exists_returnRowNum(email=emailaddress, phone=phone)
		
		datarow = [response_data['bridename'],
						response_data['groomname'],
						phone,
						emailaddress,
						response_data['howdidyouhear'],
						response_data['eventdate1'],
						response_data['eventtype1'],
						response_data['eventvenue1'],
						response_data['eventdate2'],
						response_data['eventtype2'],
						response_data['eventvenue2'],
						response_data['eventdate3'],
						response_data['eventtype3'],
						response_data['eventvenue3'],
						response_data['requiredoutfit'],
						response_data['noofgowns'],
						response_data['preferredoutfit'],
						response_data['preferredoutOthers'],

						response_data['preferredstyle'],
						response_data['preferredstyleOthers'],

						response_data['preferredNeckline'],
						response_data['preferredNeckOthers'],

						response_data['attendant'],
						response_data['additionalnotes'],
						]

		### === Process Tablet Form Reaction === ###
		tabletFormMessage = updateGS_TabletForm(datarow=datarow,rowcheckresult=gsTablet_EmailrowNum)

		### === Process Customer ID message 
		return HttpResponse(json.dumps({"tabletform_msg": tabletFormMessage }),
			content_type="application/json")
	else:
		return HttpResponse(json.dumps({"tabletform_msg": "not a POST request."}),
			content_type="application/json")

def processcustomeracct(request):

	if request.method == 'POST':
		print('processCustomerAcct view reached..')

		response_data = dealwithresponsedata(request.POST)
		emailaddress = response_data.get('emailfield')
		phone = response_data.get('phonenum')

		# 1. check if record is available in Customer Google Sheet
		gsCust_CustIDrowNum = check_EmailorPhone_exists_returnRowNum(email=emailaddress, phone=phone)
		# return row number if available, else returns error message
		
		# 2. process Customer Record, (if rowcheckresult is integer, then)
		custFormMessage, availcustID = updateGS_CustomerForm(response_data= response_data,
												rowcheckresult=gsCust_CustIDrowNum)

		### === Process Customer ID message 
		return HttpResponse(json.dumps({"custform_msg": custFormMessage ,
										"availcustID": availcustID}),
			content_type="application/json")
	else:
		return HttpResponse(json.dumps({"custform_msg": "not a POST request.",
			"availcustID": None}),
			content_type="application/json")

def processorders(request):
	if request.method == 'POST':
		print('processOrders view reached..')

		response_data = dealwithresponsedata(request.POST)
		emailaddress = response_data.get('emailfield')
		phone = response_data.get('phonenum')

		eventdict = {'weddingdate': None,
					'PWS': None,
					'ROMdate' : None,}

		eventdict = updateEventDict(eventdict=eventdict, respons_edata=response_data, eventnum=1)
		eventdict = updateEventDict(eventdict=eventdict, response_data=response_data, eventnum=2)
		eventdict = updateEventDict(eventdict=eventdict, response_data=response_data, eventnum=3)

		# 1. check if order exist in GS
		message = check_OrderNumorOrderID_exists_returnRowNum(custID=response_data['cust_id'])

		if isinstance(message, int): # if available in GS, return order number
			gsrownum = message
			# get order number and order id
			custID, orderID, ordernum, orderstatus, order_order, order_weddingdate, \
			order_pwsdate, order_romdate = get_order_rowvalues_from_GS(gsrownum)

			message = "Latest Order in GS at row {}, Order Number: {} Order Id: {}".format(gsrownum, 
																							ordernum,
																							orderID)

		else: # if does not have existing orders in GS,(can't check booqable as need order number)
			
			# create new order set in booqable
			customer_id, orderID, ordernum, orderstatus, orderdetails, order_weddingdate, \
			order_pwsdate, order_romdate = create_Order_in_booqable(custID=response_data['cust_id'],
							weddingdate=eventdict.get("weddingdate",""), order_pwsdate=eventdict.get("PWS", ""))
			# insert new order in GS
			insertNewOrder_in_GS(customer_id=customer_id, orderID=orderID, ordernum=ordernum, 
				orderstatus=orderstatus, orderdetails=orderdetails, 
				order_weddingdate=order_weddingdate, order_pwsdate=order_pwsdate, order_romdate=order_romdate)

			message = "New Order Created under #{}, Order id: {}".format(ordernum,orderID)


		return HttpResponse(json.dumps({"orders_msg": message}),
			content_type="application/json")
	else:
		return HttpResponse(json.dumps({"orders_msg": "not a POST request."}),
			content_type="application/json")

def updatecustomerinGSview(request):
	if request.method == 'POST':

		# pre-processing
		customernum = request.POST.get('customernum')

		if customernum is None: customernum = ""

		message = ""
		# 1. get order details from booqable.
		email, custID, custname, custNum, custhp = searchForCustDetailsInBooqable(custNum=customernum)
		if custNum is None:
			message = email # is an error message

		# 2. Update GS
		else:
			# 1. check if record is available in Customer Google Sheet
			gsCust_CustIDrowNum = check_EmailorPhone_exists_returnRowNum(email=email, phone=custhp)
			
			# 2. process Customer Record, (if rowcheckresult is integer, then)
			if not isinstance(gsCust_CustIDrowNum, int):
				# insert row in GS sheet
				insertNewCustID_in_GS(email=email,custID=custID, name=custname, custNum=custNum, phone=custhp)
				message = "Customer #{}, id: {} exist in Booqable and created in GS in row 2".format(custNum, custID)
			
			else:
				# update acct details
				custFormMessage, availcustID = updateGS_CustomerForm(response_data= {'bridename': custname,
																		'emailfield': email,
																		'phonenum': custhp},
													rowcheckresult=gsCust_CustIDrowNum)

				message = custFormMessage
			
			

		return HttpResponse(json.dumps({"customer_msg": message}),
			content_type="application/json")
	else:
		return HttpResponse(json.dumps({"customer_msg": "not a POST request."}),
			content_type="application/json")

def updateorderinGSview(request):
	if request.method == 'POST':

		# pre-processing
		ordernum = request.POST.get('ordernum')
		orderid = request.POST.get('orderid')
		if ordernum is None: ordernum = ""
		if orderid is None: orderid = ""

		message = ""
		# 1. get order details from booqable.
		# 2. locate order row in GS
		# 3. update GS row.
		# 4. if no row in GS, insert GS row.
		custID, orderID, ordernum, status, orderdetails, order_weddingdate, \
		order_pwsdate, order_romdate, matchingrow = updateOrder_in_GS(ordernum=ordernum, orderID=orderid )
		if status is None:
			message = custID
		else:
			message = "Order updated in GS row {}, for Order Number: {}, Order Id: {}".format(matchingrow, ordernum, orderID)

		return HttpResponse(json.dumps({"orders_msg": message}),
			content_type="application/json")
	else:
		return HttpResponse(json.dumps({"orders_msg": "not a POST request."}),
			content_type="application/json")

def updateinvoiceinGSview(request):
	if request.method == 'POST':

		# pre-processing
		invoicenum = request.POST.get('invoicenum')
		if invoicenum is None: invoicenum = ""

		message = ""
		# 1. get invoice details from booqable.
		customer_id, doc_id, name, invoicenum, \
	    	orderID, invoicefullnum, doc_type, matchingrow = updateInvoiceInGS(invoiceNum=invoicenum)
		# 2. locate order row in GS
		if matchingrow is None:
			message = customer_id
		else:
			message = "Order updated in GS row {}, for Invoice Number: {}, Document Id: {}".format(matchingrow, 
																				invoicefullnum, doc_id)

		return HttpResponse(json.dumps({"invoice_msg": message}),
			content_type="application/json")
	else:
		return HttpResponse(json.dumps({"invoice_msg": "not a POST request."}),
			content_type="application/json")

def updatefittingdatesinGSview(request):
	if request.method == 'POST':
		service = initGC()
		message = updateFittingTimes(service=service, lookbackdays=30)

		return HttpResponse(json.dumps({"fittingdates_msg": message}),
			content_type="application/json")
	else:
		return HttpResponse(json.dumps({"fittingdates_msg": "not a POST request."}),
			content_type="application/json")

def retrieveformdetails(request):

	if request.method == 'POST':
		
		email = request.POST.get('email', "")#.lower() # to lowercase?
		phonenum = request.POST.get('phone', "")

		# search by email
		emailrowInt = check_email_in_GS_TabletForm(email=email)
		phonenumrowInt = check_phonenum_in_GS_TabletForm(phonenum=phonenum)

		tabletsht = logtosheet("Tablet Form")

		if isinstance(emailrowInt, int):
			# go to row and retrieve information
			print("retrieving via email address")
			tabletrowdetails = tabletsht.row_values(emailrowInt)

			if len(tabletrowdetails) <24:
				requiredpad = 24 - len(tabletrowdetails)
				appendpad = [""] * requiredpad
				tabletrowdetails.extend(appendpad)

			message = {
			'bridename' : tabletrowdetails[0],
			'groomname' : tabletrowdetails[1],
			'phonenum' :  tabletrowdetails[2],
			'emailfield' : tabletrowdetails[3],
			'howdidyouhear' : tabletrowdetails[4],
			'eventdate1' :  tabletrowdetails[5],
			'eventtype1' : tabletrowdetails[6],
			'eventvenue1' : tabletrowdetails[7],
			'eventdate2' :  tabletrowdetails[8],
			'eventtype2' : tabletrowdetails[9],
			'eventvenue2' : tabletrowdetails[10],
			'eventdate3' :  tabletrowdetails[11],
			'eventtype3' : tabletrowdetails[12],
			'eventvenue3' : tabletrowdetails[13],
			'requiredoutfit' : tabletrowdetails[14],
			'noofgowns' : tabletrowdetails[15],
			'preferredoutfit' : tabletrowdetails[16],
			'preferredoutOthers' : tabletrowdetails[17],
			'preferredstyle' : tabletrowdetails[18],
			'preferredstyleOthers' : tabletrowdetails[19],
			'preferredNeckline' : tabletrowdetails[20],
			'preferredNeckOthers' : tabletrowdetails[21],

			'attendant': tabletrowdetails[22],
			'additionalnotes': tabletrowdetails[23],
			}

		elif isinstance(phonenumrowInt, int):
			# go to row and retrieve information

			print("retrieving via phone")
			tabletrowdetails = tabletsht.row_values(phonenumrowInt)
			print(tabletrowdetails)

			if len(tabletrowdetails) <24:
				requiredpad = 24 - len(tabletrowdetails)
				appendpad = [""] * requiredpad
				tabletrowdetails.extend(appendpad)

			print(tabletrowdetails)
			message = {
			'bridename' : tabletrowdetails[0],
			'groomname' : tabletrowdetails[1],
			'phonenum' :  tabletrowdetails[2],
			'emailfield' : tabletrowdetails[3],
			'howdidyouhear' : tabletrowdetails[4],
			'eventdate1' :  tabletrowdetails[5],
			'eventtype1' : tabletrowdetails[6],
			'eventvenue1' : tabletrowdetails[7],
			'eventdate2' :  tabletrowdetails[8],
			'eventtype2' : tabletrowdetails[9],
			'eventvenue2' : tabletrowdetails[10],
			'eventdate3' :  tabletrowdetails[11],
			'eventtype3' : tabletrowdetails[12],
			'eventvenue3' : tabletrowdetails[13],
			'requiredoutfit' : tabletrowdetails[14],
			'noofgowns' : tabletrowdetails[15],
			'preferredoutfit' : tabletrowdetails[16],
			'preferredoutOthers' : tabletrowdetails[17],
			'preferredstyle' : tabletrowdetails[18],
			'preferredstyleOthers' : tabletrowdetails[19],
			'preferredNeckline' : tabletrowdetails[20],
			'preferredNeckOthers' : tabletrowdetails[21],

			'attendant': tabletrowdetails[22],
			'additionalnotes': tabletrowdetails[23],
			}

		else:
			message = {"error": "could not find email or phone in history sheet."}

		return HttpResponse(json.dumps(message),
			content_type="application/json")

	else:
		return HttpResponse(json.dumps({"retrieve_msg": "not a POST request."}),
			content_type="application/json")


