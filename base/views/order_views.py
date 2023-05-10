from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from rest_framework import status
from datetime import datetime
import requests
from urllib.parse import urlencode



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # (1) Create order

        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # (2) Create shipping address

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        # (3) Create order items adn set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url,
            )

            # (4) Update stock

            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    

    query = request.query_params.get('keyword')
    if query == None:
        query = ''

    orders = Order.objects.filter(
        Q(user_id__in=User.objects.filter(email__contains=query)) |
        Q(_id__icontains=query)).order_by('-_id')
    
        

    page = request.query_params.get('page')
    paginator = Paginator(orders, 20)
    page_items = paginator.get_page(page)

    try:
        orders = paginator.page(page)
    except PageNotAnInteger:
        orders = paginator.page(1)
    except EmptyPage:
        orders = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)
    print('Filters:',request.headers.get('Filters'))
    serializer = OrderSerializer(orders, many=True)
    return Response({'orders': serializer.data, 'page': page, 'pages': paginator.num_pages, 'has_next': page_items.has_next(),'has_previous': page_items.has_previous(), 'total_pages': paginator.num_pages,'total_items': paginator.count})



@api_view(['GET'])
@permission_classes([IsAdminUser])
def getVesselSchedules(request):


    try:
        params = {'vesselIMONumber': '9332999', 'dateRange': 'P4W', 'carrierCodes': 'MAEU'}
        url = 'https://api.maersk.com/schedules/vessel-schedules?' + urlencode(params)
        headers = {'Content-Type': 'application/json', 'Consumer-Key': '0nUULc9nMtJWGbrean2Asez3fWeIqkEf'}
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
             return Response({'detail': 'No schedudle'}, status=status.HTTP_400_BAD_REQUEST)


        vesselsSchedules = response.json()
        print(response)
        return Response(vesselsSchedules)
    except requests.exceptions.RequestException as e:
        # Catch any exceptions that occur when calling the API
        return Response({'detail': 'No schedudle'}, status=status.HTTP_400_BAD_REQUEST)
        # return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):

    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this order'},
                     status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was delivered')
