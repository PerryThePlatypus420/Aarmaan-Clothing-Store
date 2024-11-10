const products = [
    {
        id: 1,
        category: 'Tees',
        title: 'Orange Tee',
        price: '1000',
        img: 'https://iraaday.com/wp-content/uploads/2024/07/DSC_0192-scaled.jpg',
        description: {
            productDescription: 'Comfortable orange tee made from 100% organic cotton. Perfect for casual wear.',
            fabricComposition: {
                material: '100% Organic Cotton',
                gsm: 180,
                texture: 'Soft and Breathable'
            },
            designDetails: {
                color: 'Brown',
                neckline: 'Crew Neck',
                fit: 'Regular',
                graphics: 'heavy'
            }
        }
    },
    {
        id: 2,
        category: 'Pants',
        title: 'Blue Jeans',
        price: '3000',
        img: 'https://lscoecomm.scene7.com/is/image/lscoecomm/STRAIGHT%20JEANS-1?fmt=jpeg&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=1200&hei=1500',
        description: {
            productDescription: 'Classic blue jeans with a straight leg fit. Durable denim for everyday wear.',
            fabricComposition: {
                material: 'Denim',
                gsm: 300,
                texture: 'Durable'
            },
            designDetails: {
                color: 'Blue',
                fit: 'Straight',
                graphics: 'None'
            }
        }
    },
    {
        id: 3,
        category: 'Tees',
        title: 'Black Tee',
        price: '1000',
        img: 'https://iraaday.com/wp-content/uploads/2024/07/DSC_0078-scaled-e1722253165165.jpg',
        description: {
            productDescription: 'Versatile black tee with a crew neck. Made from soft, breathable fabric.',
            fabricComposition: {
                material: 'Cotton Blend',
                gsm: 180,
                texture: 'Soft and Breathable'
            },
            designDetails: {
                color: 'Black',
                neckline: 'Crew Neck',
                fit: 'Regular',
                graphics: 'yellow thunder with text'
            }
        }
    },
    {
        id: 4,
        category: 'Accessories',
        title: 'Wing Pendant',
        price: '1500',
        img: 'https://shoprusset.com/cdn/shop/products/image_69ff6121-0cb1-4695-863a-1a655fc016ce.jpg?v=1672234257&width=2144',
        description: {
            productDescription: 'Elegant silver necklace with a minimalist wing pendant. Suitable for any occasion.',
            material: 'Silver',
            designDetails: {
                pendant: 'Minimalist',
                color: 'Silver'
            }
        }
    },
    {
        id: 5,
        category: 'Shoes',
        title: 'Grey Shoes',
        price: '4000',
        img: 'https://onepoint.pk/cdn/shop/products/shoeexpress-shoes-price-pakistan.jpg?v=1677566567',
        description: {
            productDescription: 'Comfortable grey sneakers with cushioned soles. Perfect for daily wear or light exercise.',
            material: 'Synthetic Fabric',
            designDetails: {
                color: 'Grey',
                sole: 'Cushioned',
                type: 'Sneakers'
            }
        }
    },
    {
        id: 6,
        category: 'Button-Shirts',
        title: 'Black Shirt',
        price: '2000',
        img: 'https://royaltag.com.pk/cdn/shop/files/CFT240143-BK_1.jpg?v=1722245147',
        description: {
            productDescription: 'Sleek black button-up shirt. Ideal for formal occasions or business wear.',
            fabricComposition: {
                material: 'Cotton Blend',
                gsm: 220,
                texture: 'Smooth'
            },
            designDetails: {
                color: 'Black',
                neckline: 'Button-Up',
                fit: 'Slim',
                graphics: 'None'
            }
        }
    },
    {
        id: 7,
        category: 'Button-Shirts',
        title: 'Blue Shirt',
        price: '2000',
        img: 'https://royaltag.com.pk/cdn/shop/files/CFC240158-SKY_1.jpg?v=1717993985',
        description: {
            productDescription: 'Classic light blue button-down shirt. Versatile piece for both casual and semi-formal settings.',
            fabricComposition: {
                material: 'Cotton',
                gsm: 200,
                texture: 'Soft'
            },
            designDetails: {
                color: 'Light Blue',
                neckline: 'Button-Down',
                fit: 'Regular',
                graphics: 'None'
            }
        }
    },
    {
        id: 8,
        category: 'Shoes',
        title: 'Black Shoes',
        price: '4000',
        img: 'https://nothingnew.com/cdn/shop/products/1024x1024-NothingNew-HighTop-JetBlack-031122-3.4_1024x1024.jpg?v=1647966444',
        description: {
            productDescription: 'Polished black leather shoes. Essential for formal wear and business attire.',
            material: 'Leather',
            designDetails: {
                color: 'Black',
                sole: 'Leather',
                type: 'Formal Shoes'
            }
        }
    },
    {
        id: 9,
        category: 'Shoes',
        title: 'Brown Samba',
        price: '4000',
        img: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/1bfe36ecdfc74c72bd48c8fd2066cfeb_9366/Samba_OG_Shoes_Brown_IG1379_01_standard.jpg',
        description: {
            productDescription: 'Retro-inspired brown sneakers. A stylish and comfortable choice for casual wear.',
            material: 'Canvas',
            designDetails: {
                color: 'Brown',
                sole: 'Rubber',
                type: 'Sneakers'
            }
        }
    },
    {
        id: 10,
        category: 'Accessories',
        title: 'Silver Ring',
        price: '1500',
        img: 'https://dappershop.pk/cdn/shop/files/15471779491667576171.jpg?v=1685705054',
        description: {
            productDescription: 'Stylish silver ring with a minimalist design. Suitable for everyday wear.',
            material: 'Silver',
            designDetails: {
                color: 'Silver',
                style: 'Minimalist'
            }
        }
    },
    {
        id: 11,
        category: 'Button-Shirts',
        title: 'White Shirt',
        price: '2000',
        img: 'https://royaltag.com.pk/cdn/shop/files/CFP240135-WT_1.jpg?v=1716874482',
        description: {
            productDescription: 'Crisp white button-up shirt. A wardrobe staple for any formal or semi-formal occasion.',
            fabricComposition: {
                material: 'Cotton',
                gsm: 200,
                texture: 'Crisp'
            },
            designDetails: {
                color: 'White',
                neckline: 'Button-Up',
                fit: 'Regular',
                graphics: 'None'
            }
        }
    },
    {
        id: 12,
        category: 'Pants',
        title: 'Black Jeans',
        price: '3000',
        img: 'https://lsco.scene7.com/is/image/lsco/290370066-detail1-pdp?fmt=webp&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=660&hei=660',
        description: {
            productDescription: 'Stylish black jeans with a slim fit. Perfect for a night out or casual Fridays.',
            fabricComposition: {
                material: 'Denim',
                gsm: 320,
                texture: 'Soft and Flexible'
            },
            designDetails: {
                color: 'Black',
                fit: 'Straight',
                graphics: 'None'
            }
        }
    },
    {
        id: 13,
        category: 'Accessories',
        title: 'Black Ring',
        price: '1500',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqI7n0h4GQVEcy18jVohfAYn_lYQ8Jvl35Ig&s',
        description: {
            productDescription: 'Sleek black ring with a modern design. Adds a touch of elegance to any outfit.',
            material: 'Black Metal',
            designDetails: {
                color: 'Black',
                style: 'Modern'
            }
        }
    },
    {
        id: 14,
        category: 'Tees',
        title: 'Olive Tee',
        price: '1000',
        img: 'https://iraaday.com/wp-content/uploads/2024/04/IMG_6463-1-scaled.jpg',
        description: {
            productDescription: 'Comfortable olive green tee. Great for layering or wearing on its own.',
            fabricComposition: {
                material: 'Cotton Blend',
                gsm: 180,
                texture: 'Soft'
            },
            designDetails: {
                color: 'Olive Green',
                neckline: 'Crew Neck',
                fit: 'Regular',
                graphics: 'minimal'
            }
        }
    },
    {
        id: 15,
        category: 'Pants',
        title: 'Khaki Chinos',
        price: '2500',
        img: 'https://cdn.suitdirect.co.uk/upload/siteimages/large/0078832_300_a.jpg',
        description: {
            productDescription: 'Classic khaki chinos. Versatile pants suitable for both casual and smart-casual occasions.',
            fabricComposition: {
                material: 'Cotton Blend',
                gsm: 250,
                texture: 'Smooth'
            },
            designDetails: {
                color: 'Khaki',
                fit: 'Regular',
                graphics: 'None'
            }
        }
    },
    {
        id: 16,
        category: 'Accessories',
        title: 'Leather Watch',
        price: '5000',
        img: 'https://ecasiocentre.pk/wp-content/webp-express/webp-images/uploads/2024/03/LTP-V005GL-9B_Seq1.jpg.webp',
        description: {
            productDescription: 'Stylish leather strap watch with a minimalist face. Adds a touch of sophistication to any outfit.',
            material: 'Leather and Stainless Steel',
            designDetails: {
                color: 'Brown Leather Strap',
                style: 'Minimalist',
                features: 'Analog Display'
            }
        }
    },
    {
        id: 17,
        category: 'Shoes',
        title: 'White Sneakers',
        price: '3500',
        img: 'https://cdn.thewirecutter.com/wp-content/media/2024/05/white-sneaker-2048px-9320.jpg?auto=webp&quality=75&width=1024',
        description: {
            productDescription: 'Clean and crisp white sneakers. A versatile footwear option for various casual outfits.',
            material: 'Canvas',
            designDetails: {
                color: 'White',
                sole: 'Rubber',
                type: 'Sneakers'
            }
        }
    },
    {
        id: 18,
        category: 'Button-Shirts',
        title: 'Striped Shirt',
        price: '2200',
        img: 'https://royaltag.com.pk/cdn/shop/files/CFL240163-OW_3_Large_169d0eea-0799-4569-8695-3c374a7eb48c.jpg?v=1715683333',
        description: {
            productDescription: 'Classic striped button-up shirt. Perfect for adding a touch of pattern to your wardrobe.',
            fabricComposition: {
                material: 'Cotton Blend',
                gsm: 240,
                texture: 'Smooth'
            },
            designDetails: {
                color: 'Striped',
                neckline: 'Button-Up',
                fit: 'Regular',
                graphics: 'Striped Pattern'
            }
        }
    },
    {
        id: 19,
        category: 'Tees',
        title: 'Blue Tee',
        price: '1200',
        img: 'https://iraaday.com/wp-content/uploads/2024/06/img_2966-scaled.jpeg',
        description: {
            productDescription: 'Soft blue tee. A comfortable and stylish choice for any casual ensemble.',
            fabricComposition: {
                material: 'Cotton Blend',
                gsm: 200,
                texture: 'Soft'
            },
            designDetails: {
                color: 'Navy Blue',
                neckline: 'V-Neck',
                fit: 'Regular',
                graphics: 'minimal'
            }
        }
    },
    {
        id: 20,
        category: 'Pants',
        title: 'Grey Dress Pants',
        price: '3500',
        img: 'https://myer.com.pk/cdn/shop/files/4-3_2547c10b-dc52-44a7-801e-d7a29788c8ad.webp?v=1717666142',
        description: {
            productDescription: 'Sleek grey dress pants. Essential for formal occasions and office wear.',
            fabricComposition: {
                material: 'Wool Blend',
                gsm: 300,
                texture: 'Smooth'
            },
            designDetails: {
                color: 'Grey',
                fit: 'Slim',
                graphics: 'None'
            }
        }
    },
    {
        id: 21,
        category: 'Accessories',
        title: 'Leather Belt',
        price: '2000',
        img: 'https://www.leisureclub.pk/cdn/shop/products/WBL701122_2.jpg?v=1650618416',
        description: {
            productDescription: 'Quality leather belt with a silver buckle. A must-have accessory for any wardrobe.',
            material: 'Leather',
            designDetails: {
                color: 'Black',
                buckle: 'Silver',
                style: 'Classic'
            }
        }
    },
    {
        id: 22,
        category: 'Shoes',
        title: 'Brown Loafers',
        price: '4500',
        img: 'https://images.thejacketmaker.com/01-Baxton-Brown-Leather-Loafers-Fronttilt-2-1675203033898.webp',
        description: {
            productDescription: 'Classic brown leather loafers. Comfortable and stylish for both casual and semi-formal wear.',
            material: 'Leather',
            designDetails: {
                color: 'Brown',
                sole: 'Leather',
                type: 'Loafers'
            }
        }
    },
    {
        id: 23,
        category: 'Button-Shirts',
        title: 'Denim Shirt',
        price: '2300',
        img: 'https://royaltag.com.pk/cdn/shop/files/PS238022-BL_2_Large_6f63a14f-f1f8-4fde-836f-dfbbdd3e16fb.jpg?v=1712348163',
        description: {
            productDescription: 'Versatile denim button-up shirt. Great for layering or wearing on its own.',
            fabricComposition: {
                material: 'Denim',
                gsm: 300,
                texture: 'Durable'
            },
            designDetails: {
                color: 'Denim Blue',
                neckline: 'Button-Up',
                fit: 'Regular',
                graphics: 'None'
            }
        }
    },
    {
        id: 24,
        category: 'Tees',
        title: 'Brown Tee',
        price: '1100',
        img: '//groovypakistan.com/cdn/shop/files/2_0876a1f1-b5a2-4e53-8f52-a2f2cc65c7dc.jpg?v=1711011399&width=1558',
        description: {
            productDescription: 'Oversized brown tee with chic and stylish graphics to elevate your casual look.',
            fabricComposition: {
                material: 'Cotton Blend',
                gsm: 180,
                texture: 'Soft'
            },
            designDetails: {
                color: 'Brown, white and orange',
                neckline: 'Crew Neck',
                fit: 'Regular',
                graphics: 'minimal'
            }
        }
    },
    {
        id: 25,
        category: 'Pants',
        title: 'Olive Cargo Pants',
        price: '2800',
        img: 'https://thehangerpakistan.com/cdn/shop/products/image_a08eca91-ffd7-4d5e-a1ce-f44def47b638_720x900.jpg?v=1680072263',
        description: {
            productDescription: 'Durable olive cargo pants with multiple pockets. Perfect for outdoor activities or casual wear.',
            fabricComposition: {
                material: 'Cotton Canvas',
                gsm: 320,
                texture: 'Rugged'
            },
            designDetails: {
                color: 'Olive',
                fit: 'Relaxed',
                graphics: 'None',
                pockets: 'Multiple'
            }
        }
    },
    {
        id: 26,
        category: 'Accessories',
        title: 'Aviator Sunglasses',
        price: '1800',
        img: 'https://www.randolphusa.com/cdn/shop/files/SatinGun_700x.png?v=1698162731',
        description: {
            productDescription: 'Classic aviator sunglasses with UV protection. Stylish and functional eyewear.',
            material: 'Metal and Glass',
            designDetails: {
                color: 'Silver Frame',
                lenses: 'UV Protection',
                style: 'Aviator'
            }
        }
    },
    {
        id: 27,
        category: 'Shoes',
        title: 'Blue Suede Sneakers',
        price: '3000',
        img: 'https://cdn.endource.com/image/b6ee0122b5d982058f8b355e5b86f242/detail/and-other-stories-suede-lace-up-sneaker.jpg?optimizer=image&class=800',
        description: {
            productDescription: 'Casual blue suede sneakers. Comfortable and stylish for everyday wear.',
            material: 'Canvas',
            designDetails: {
                color: 'Blue',
                sole: 'Rubber',
                type: 'Sneakers'
            }
        }
    },
    {
        id: 28,
        category: 'Button-Shirts',
        title: 'Green Check Casual Shirt',
        price: '2400',
        img: 'https://royaltag.com.pk/cdn/shop/files/CC240260-GN_3_Large_a2581d06-51a8-43bd-b288-3d5d47191ba1.jpg?v=1715922941',
        description: {
            productDescription: 'Eye-catching green check print shirt. Perfect for summer parties or tropical vacations.',
            fabricComposition: {
                material: 'Cotton',
                gsm: 220,
                texture: 'Lightweight'
            },
            designDetails: {
                color: 'Checkered Green',
                neckline: 'Button-Up',
                fit: 'Regular',
                graphics: 'Checkered Pattern'
            }
        }
    },
    {
        id: 29,
        category: 'Tees',
        title: 'White Tee',
        price: '1000',
        img: 'https://iraaday.com/wp-content/uploads/2024/07/DSC_0152-scaled-e1722255299938-1447x2048.jpg',
        description: {
            productDescription: 'Chic white tee. A versatile basic that pairs well with any outfit.',
            fabricComposition: {
                material: 'Cotton',
                gsm: 180,
                texture: 'Soft'
            },
            designDetails: {
                color: 'White',
                neckline: 'V-Neck',
                fit: 'Regular',
                graphics: 'minimal'
            }
        }
    },
    {
        id: 30,
        category: 'Pants',
        title: 'Navy Dress Pants',
        price: '3500',
        img: 'https://myer.com.pk/cdn/shop/files/2-2_81c2f796-3fdf-4182-ac1e-eb0874b54f8e.webp?v=1717671870',
        description: {
            productDescription: 'Sharp navy dress pants. Essential for formal occasions and professional settings.',
            fabricComposition: {
                material: 'Wool Blend',
                gsm: 300,
                texture: 'Smooth'
            },
            designDetails: {
                color: 'Navy',
                fit: 'Slim',
                graphics: 'None'
            }
        }
    }
];

export default products;
