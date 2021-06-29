USE capp;
SELECT m.`order` FROM members m WHERE m.user_id = '40ede82c-41a3-44b9-97d7-25dc25bde568' ORDER BY m.`order` DESC LIMIT 1;
CALL create_server('40ede82c-41a3-44b9-97d7-25dc25bde568', 'fffff', 1)

CALL create_server('40ede82c-41a3-44b9-97d7-25dc25bde568', 'asdsa', 0)

# 100 test users
SET @user1 = '40ede82c-41a3-44b9-97d7-25dc25bde568';
SET @user10 = '02609aeb-1317-47c9-a8d0-d3c7b98c26e3';
SET @user100 = '0f854c32-4aab-4ef4-b47d-96ea04e63206';
SET @user11 = 'cb9fcab5-2fed-4002-9e3b-5d77bbdfb184';
SET @user12 = 'b1e02e42-03c9-404a-9481-fc2b0b3202f9';
SET @user13 = '3f73fb0e-e2c8-473e-a722-1d74fe62e289';
SET @user14 = '72b149db-aa3e-4935-83cf-422c679d70d8';
SET @user15 = '764e6c0e-b7a4-4aa1-8a12-14f117890a0e';
SET @user16 = '88cc14b6-5e2d-4309-baaa-70379acf8617';
SET @user17 = 'c3c03e2d-a624-4e8e-ae38-4ba37bd2d92e';
SET @user18 = '1ee930db-acfb-425c-a439-21a60ee7539a';
SET @user19 = '6b18a12a-b114-4ede-9a4f-47c85e539dfd';
SET @user2 = '588ed943-d335-4b2c-89fc-98e1745e8859';
SET @user20 = '6bee0a4c-eec0-43f0-ba45-0912bf428abb';
SET @user21 = 'a2b0eeab-61fe-431c-98c6-4e727d907b2a';
SET @user22 = 'ffd84094-e93e-4472-a924-d924c515a935';
SET @user23 = 'ab950251-3e26-4059-9edd-bebaa92f2aea';
SET @user24 = '9fc1e307-cc61-4dbe-84ee-fa4d6f71537d';
SET @user25 = '69902aa6-097e-42ee-8131-0becf43aba69';
SET @user26 = '21567e40-7680-487e-aa98-6ee5ba1a7143';
SET @user27 = '9b7b853b-1547-4bb1-b62b-cd2bda6c5bf9';
SET @user28 = 'cb703f82-9a68-4b38-af61-5e4b3f3cdc2e';
SET @user29 = '8e8d254f-1e8d-4b8e-869e-bb607d16fbaf';
SET @user3 = '7d3477c1-a40d-4fd8-9ce5-bf856134d7e9';
SET @user30 = 'b8e1dd4f-8108-49a2-aeab-b950d9707514';
SET @user31 = '646112bc-c320-459e-8fef-f288536d3389';
SET @user32 = 'c44f9f3c-98ed-4f74-a3d9-8a6b526fda85';
SET @user33 = '5b001753-1a69-48fe-9d06-6ab38c33c8c2';
SET @user34 = 'b4015dce-a886-488b-8c60-0ceb95464f2c';
SET @user35 = 'b2dca055-4aa7-49ff-9c41-136b0d12538d';
SET @user36 = '3c15c751-2b06-475e-8e03-fff4ce52f053';
SET @user37 = '1ac43df5-5779-4c64-b5a0-9c2c208169fb';
SET @user38 = '9f28ed4f-3171-4ea0-a9cd-c42b1ccbea8c';
SET @user39 = '6ee35c88-9229-456b-9504-c2a8ff78dc39';
SET @user4 = 'c7c2415b-8916-47cb-96fb-cf5f0acbea18';
SET @user40 = '7cae6b0e-ca25-4e49-b156-faddd167243f';
SET @user41 = 'abfdb31b-65a5-4c9b-bb1b-56fda0ba1649';
SET @user42 = '68c3d885-da8f-4bf0-857b-6391e95f15c8';
SET @user43 = 'e1110bc3-9cee-460e-a950-c6cf29a394bd';
SET @user44 = '8db0d92c-bfd9-44d1-9391-5d5f559b3154';
SET @user45 = '2dc04612-02b0-4808-88a8-aede5224cb92';
SET @user46 = '73bf8f8a-34ec-49ac-8702-14ba1a095daa';
SET @user47 = '03b1ff91-bb38-4aca-9641-0db111bb685c';
SET @user48 = '635d6f23-cc51-4981-8809-d8eb4687c264';
SET @user49 = '10483af1-1476-445b-92d4-be7dca1480f2';
SET @user5 = '3908cbcc-c498-49a1-8049-718ac9f1922f';
SET @user50 = '68c8d3a4-20d7-4304-8042-f5517772b035';
SET @user51 = 'aea74eb7-21a7-4b50-827e-5b0bc060704c';
SET @user52 = '2012348c-d0da-43be-9485-1815bcf7ad7f';
SET @user53 = '19301eae-36ab-4588-9b82-ecb24421b0ff';
SET @user54 = '6d4b5f0c-08ef-4cc2-b079-a53d347a3b5e';
SET @user55 = '566d50be-8496-4540-8392-0ad3eb72fbb6';
SET @user56 = '31999c0a-e02a-488a-a1bc-2023f7816480';
SET @user57 = 'eb3da25e-58f9-48de-bb79-4ea7b12d79a6';
SET @user58 = '327cde04-1060-4e28-8c1b-87a165706ecf';
SET @user59 = 'b055c80d-26ea-49a9-8375-b3b926722a6c';
SET @user6 = '815bbfd7-4690-4428-81fb-60c050cbcb80';
SET @user60 = 'e5e56f36-1820-4e2e-bfc2-4d415af4511b';
SET @user61 = '9a04b5a5-fbca-4556-9e22-2429dc798ce7';
SET @user62 = '314cd6dc-3e50-480a-a359-0509e1349247';
SET @user63 = '672038e1-4379-465b-8ae3-70ae653410ac';
SET @user64 = 'fb7dbd30-1ab7-4177-a0a9-885aab058136';
SET @user65 = '3f704c0d-e549-438c-b685-ceb1f76ed405';
SET @user66 = 'd37727b2-34e3-4bd7-a77e-023e4024a598';
SET @user67 = 'f6691640-3e77-4815-a47e-0c28adcab264';
SET @user68 = 'fe834c05-bc51-48dc-9e6f-2cb13e3c33bf';
SET @user69 = '174f24a6-bb00-4c13-a5eb-c4a2c5d59d3b';
SET @user7 = '2aab4bcb-30f3-4869-aaa7-1e01ef6bbfe1';
SET @user70 = 'b51c9a3a-4223-42db-bfa6-e05dab299a74';
SET @user71 = 'f1fc4815-38e8-45c9-8d04-4c81988fc40c';
SET @user72 = '2fa50f54-7633-457d-b8d0-71cabeeca89a';
SET @user73 = 'dede5fd7-e1ba-448e-9bf4-fe3ecf9152d7';
SET @user74 = '48c83eaf-8e3e-4bc8-b953-6d978971d282';
SET @user75 = '795653a4-0582-437a-a13e-f7d5d1417a7d';
SET @user76 = '00e7e8d4-6752-450b-966e-018c4c8d7b49';
SET @user77 = '2718b725-6937-4e38-b898-72df02852d5b';
SET @user78 = 'c7b82576-9e98-4215-b011-3943a0411a61';
SET @user79 = '3fefb959-5e7c-47d4-9093-f7737a8b9c9c';
SET @user8 = 'a7937b32-0746-4c9e-bd94-67d5a47f531c';
SET @user80 = '6a6fd7b1-04ea-44f6-93c8-8f13855a4e63';
SET @user81 = '42e51908-0236-4bd8-8c73-075cf45561b6';
SET @user82 = '34f745fe-c33f-4622-b5e1-9ae6028efcfb';
SET @user83 = '03df2b61-9391-4b3c-9450-e06259aed665';
SET @user84 = '5612a5b6-ff5b-473d-9a16-5c11292a1937';
SET @user85 = '67eb5f07-55ff-4cd6-9ee4-98e541ad6279';
SET @user86 = '6504c229-bd57-4463-93eb-086f7ffe814e';
SET @user87 = '2d05e426-3a05-4016-ad6a-5c9570ca41d8';
SET @user88 = '8f755ff7-039d-4477-b21d-02ca2eb502a1';
SET @user89 = '1202db60-1876-42d1-87e5-a00c7373bd68';
SET @user9 = '3b41f4bf-d059-4289-a2e0-3eb2d3c2f2b0';
SET @user90 = '06489b43-d3f2-4199-a4f4-b041576d05a0';
SET @user91 = '7183f4e2-1365-4e60-b7bc-3994d0f335a4';
SET @user92 = '076837c7-aced-41a6-8b58-5a24483b94d6';
SET @user93 = '541de8e2-528c-41e5-990a-83dc784c231d';
SET @user94 = 'e743f065-fd61-4ca0-839f-4ff0f139459b';
SET @user95 = 'b4c8b0d3-c209-451e-a6bd-03e61d4584c2';
SET @user96 = '16b09fc1-4aab-4256-a30a-faea8efba91b';
SET @user97 = 'a14b0631-2fc1-4470-9ffc-051efd571fe9';
SET @user98 = 'ff2ce64e-4a00-401e-bb8b-7d033920a11b';
SET @user99 = 'fff170b3-2e1e-4b24-9b9a-972b1d6fea37';

# create 9 servers
CALL create_server(@user1, 'a new server 1', 0);
CALL create_server(@user2, 'a new server 2', 0);
CALL create_server(@user3, 'a new server 3', 0);
CALL create_server(@user4, 'a new server 4', 0);
CALL create_server(@user5, 'a new server 5', 0);
CALL create_server(@user6, 'a new server 6', 0);
CALL create_server(@user7, 'a new server 7', 0);
CALL create_server(@user8, 'a new server 8', 0);
CALL create_server(@user9, 'a new server 9', 0);

# create invitation for each server
SELECT create_invitation(@user1, 1) INTO @invitation1;
SELECT create_invitation(@user2, 2) INTO @invitation2;
SELECT create_invitation(@user3, 3) INTO @invitation3;
SELECT create_invitation(@user4, 4) INTO @invitation4;
SELECT create_invitation(@user5, 5) INTO @invitation5;
SELECT create_invitation(@user6, 6) INTO @invitation6;
SELECT create_invitation(@user7, 7) INTO @invitation7;
SELECT create_invitation(@user8, 8) INTO @invitation8;
SELECT create_invitation(@user9, 9) INTO @invitation9;

# invite 9 different users in each server
CALL join_server(@user11, @invitation1);
CALL join_server(@user12, @invitation1);
CALL join_server(@user13, @invitation1);
CALL join_server(@user14, @invitation1);
CALL join_server(@user15, @invitation1);
CALL join_server(@user16, @invitation1);
CALL join_server(@user17, @invitation1);
CALL join_server(@user18, @invitation1);
CALL join_server(@user19, @invitation1);

CALL join_server(@user21, @invitation2);
CALL join_server(@user22, @invitation2);
CALL join_server(@user23, @invitation2);
CALL join_server(@user24, @invitation2);
CALL join_server(@user25, @invitation2);
CALL join_server(@user26, @invitation2);
CALL join_server(@user27, @invitation2);
CALL join_server(@user28, @invitation2);
CALL join_server(@user29, @invitation2);

CALL join_server(@user31, @invitation3);
CALL join_server(@user32, @invitation3);
CALL join_server(@user33, @invitation3);
CALL join_server(@user34, @invitation3);
CALL join_server(@user35, @invitation3);
CALL join_server(@user36, @invitation3);
CALL join_server(@user37, @invitation3);
CALL join_server(@user38, @invitation3);
CALL join_server(@user39, @invitation3);

CALL join_server(@user41, @invitation4);
CALL join_server(@user42, @invitation4);
CALL join_server(@user43, @invitation4);
CALL join_server(@user44, @invitation4);
CALL join_server(@user45, @invitation4);
CALL join_server(@user46, @invitation4);
CALL join_server(@user47, @invitation4);
CALL join_server(@user48, @invitation4);
CALL join_server(@user49, @invitation4);

CALL join_server(@user51, @invitation5);
CALL join_server(@user52, @invitation5);
CALL join_server(@user53, @invitation5);
CALL join_server(@user54, @invitation5);
CALL join_server(@user55, @invitation5);
CALL join_server(@user56, @invitation5);
CALL join_server(@user57, @invitation5);
CALL join_server(@user58, @invitation5);
CALL join_server(@user59, @invitation5);

CALL join_server(@user61, @invitation6);
CALL join_server(@user62, @invitation6);
CALL join_server(@user63, @invitation6);
CALL join_server(@user64, @invitation6);
CALL join_server(@user65, @invitation6);
CALL join_server(@user66, @invitation6);
CALL join_server(@user67, @invitation6);
CALL join_server(@user68, @invitation6);
CALL join_server(@user69, @invitation6);

CALL join_server(@user71, @invitation7);
CALL join_server(@user72, @invitation7);
CALL join_server(@user73, @invitation7);
CALL join_server(@user74, @invitation7);
CALL join_server(@user75, @invitation7);
CALL join_server(@user76, @invitation7);
CALL join_server(@user77, @invitation7);
CALL join_server(@user78, @invitation7);
CALL join_server(@user79, @invitation7);

CALL join_server(@user81, @invitation8);
CALL join_server(@user82, @invitation8);
CALL join_server(@user83, @invitation8);
CALL join_server(@user84, @invitation8);
CALL join_server(@user85, @invitation8);
CALL join_server(@user86, @invitation8);
CALL join_server(@user87, @invitation8);
CALL join_server(@user88, @invitation8);
CALL join_server(@user89, @invitation8);

CALL join_server(@user91, @invitation9);
CALL join_server(@user92, @invitation9);
CALL join_server(@user93, @invitation9);
CALL join_server(@user94, @invitation9);
CALL join_server(@user95, @invitation9);
CALL join_server(@user96, @invitation9);
CALL join_server(@user97, @invitation9);
CALL join_server(@user98, @invitation9);
CALL join_server(@user99, @invitation9);

CALL join_server(@user10, @invitation1);
CALL join_server(@user10, @invitation2);
CALL join_server(@user10, @invitation3);
CALL join_server(@user10, @invitation4);
CALL join_server(@user10, @invitation5);
CALL join_server(@user10, @invitation6);
CALL join_server(@user10, @invitation7);
CALL join_server(@user10, @invitation8);
CALL join_server(@user10, @invitation9);

# SELECT create_channel('509652db-483c-4328-85b1-120573723b3a', 1, NULL, 'text', 'channel without group', 0);
# SELECT create_channel('509652db-483c-4328-85b1-120573723b3a', 1, 1, 'text', 'text channel in the first group', 1);
# SELECT create_channel('509652db-483c-4328-85b1-120573723b3a', 1, 2, 'voice', 'voice channel in the second group', 1);
#
# SELECT create_group('509652db-483c-4328-85b1-120573723b3a', 1, 'a new group', 2);
# SELECT create_channel('509652db-483c-4328-85b1-120573723b3a', 1, 3, 'text', 'text channel in the third group', 0);
# SELECT create_channel('509652db-483c-4328-85b1-120573723b3a', 1, 3, 'voice', 'voice channel in the third group', 1);
#
# SELECT create_invitation('509652db-483c-4328-85b1-120573723b3a', 1);
# CALL join_server('8161216d-c1c8-4d01-b21a-ba1f559d29e9', (
#     SELECT create_invitation('509652db-483c-4328-85b1-120573723b3a', 1)
# ));
#
# CALL get_user_servers_data('509652db-483c-4328-85b1-120573723b3a');
# CALL get_user_servers_data('8161216d-c1c8-4d01-b21a-ba1f559d29e9');