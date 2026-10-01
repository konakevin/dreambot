-- 643_location_pool_drift_repair: NIGHTLY_POOL_CLEANUP_PLAN.md phase 4 step 2, every place card's spots checked against
-- its definition (migs 641/642), scripts/clean-location-pools.js --pass drift + drift-confirm. A first read flagged
-- 5,714 spots, a keep-by-default second read confirmed 2,203, and every confirmed flag was reviewed by hand: real drift
-- goes (neighbouring towns on beach cards, other Himalayan peaks on Everest, Civil War memorials on Epic Battlefield,
-- Swiss landmarks on Alpine Chalet, red-rock parks on Cattle Ranch, LA sightseeing on Red Carpet, Stone Age monuments on
-- Prehistoric, a toy TOWN on an interior-only toy shop), real fits stay (Fuji on Feudal Japan, Ghost Ranch on Cattle Ranch,
-- the Harry Potter places on High Fantasy, which Kevin is leaving for now). Pools left under 60 (and the rebuilt cards)
-- are refilled with new spots graded S/A and passed through a duplicate read; genre and era cards refill with kinds of
-- places (--themed), not named landmarks; every new spot was read and ~110 cut (objects, back rooms, infrastructure).
-- Deactivated = is_active false (reversible, nothing deleted). Flags: cast = non-wide, scene-only = non-intimate.
-- 2145 deactivated, 752 added. Re-runnable.

UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fe899ca4-5f9c-467a-a14a-6d07db868a07' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '001626f1-fae2-482d-96cf-3dba3bcd3287' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '00d410d6-df28-4179-baf1-84803d142122' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '02921058-7287-4ba3-87e9-ad7d754b778e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '02c1388f-a709-42eb-84cb-19a418dca7e1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '03351d98-3c68-4fb5-b830-901ec91f3e8f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '039970b0-41c3-4133-9672-cba3e391bdd4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '07c60c7a-62da-46ca-b3ef-2f450526ae75' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '08820727-3c01-490a-bfbb-25266674d791' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '08fec9d9-7f5a-4b91-adbc-ef2c08bb2818' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0bfc4e4c-8863-4752-b3c6-035a10ceeed0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '10192010-5d9a-4d7b-b3b3-47d01868ed11' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '118b0a01-45f9-4524-b14b-c726a9e9a7f5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '118e685e-de1d-404d-9294-2c32fc0fcba3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '14692c25-592a-4ec2-9dc7-14cd15106a5e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '17b24342-009e-449b-8b3b-9064d78c6059' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '18411cc4-1875-4c1f-b3f3-ba14e94563e0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19bc25ca-2ca8-4e4e-b285-6ef9c4d8c1cc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1a34fdd9-7e2f-4374-bb6f-75947c3c1242' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1af6393b-6721-4e65-966e-56ff1c0a36af' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1b42d9ad-b997-4853-8464-d6e425882f4c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '22f780b9-aa1d-4c75-9185-b360faf59c19' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2d98db2d-00bd-4011-8c69-0c538f1f94d0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2e7373a6-2025-4a31-bbc3-aba1a1a0cd1f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2f2632f3-3e51-49d4-9be1-7b7e62db26b1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2f3549bf-9c05-4848-b2ac-56c17b1c0998' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '30271979-3a8c-47fc-877e-6c0ade3cd048' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '30443ced-211e-4f50-9463-6e1d5d673985' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '33403830-429c-4869-b692-0c92c9eafaaf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '36d6cbd9-d20a-4212-b8ab-df0246bd4eba' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3ac6700f-a9af-4224-88f9-6e366f04f0c9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3adf6bef-f31b-4983-9008-972799bb9dc2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3bd61495-0411-4104-8866-e8a2a8fe11f6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3d0119c8-8bfc-4304-83a7-475c4a2f8314' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3ffc0323-a375-41cf-bc9f-238c05603f83' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '40b585a4-378c-4067-b879-b33606d90add' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '40e753ea-35f8-46b9-b430-a6d446a86a52' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '413d9b04-0c3f-4477-acdf-8fa2a534f44c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '47906d6a-21b2-448a-97c4-5e141eb02309' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4cb5f1b6-e8ee-4223-aaeb-9942f9ffd710' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4d2dde84-7456-4874-a51e-c63c67cd7866' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4ec9df8b-8a01-4bdc-a302-d3fd303f3d8a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4f32cd79-da26-4103-aa2c-07ad2409900a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5018865d-0406-4268-9dc0-29bdfa8c5034' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '501f5a52-6f61-4400-8466-da2e94e7be05' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5138a77d-090c-4dd7-84ab-a01ede25f847' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '549cf30a-3a10-4015-b0cd-48ed72869799' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '58b860f8-f987-4c76-b3f3-6c21c8be0ddc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5bcd7d84-818e-4a45-91ed-09adb2bd233a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5c08556a-a5f3-42d4-b68b-455a3be53757' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '60e922f8-f940-4e5f-a884-0e7ae54066eb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '620cfce7-0b92-4979-aacb-babaac1b8137' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '62625e5c-854e-4c04-a08c-6a9216cdb010' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6392cd9d-1584-4b8d-83c5-30e83f360bee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '63f938c2-aaad-4131-814c-a7a17b095ed5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '641d37fc-4385-4d4c-84e6-304dd8fab1cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6514a439-1049-4cfa-b51e-20ba5b3945a7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '66c3446a-cca1-4309-b487-102f848734dc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '735dab25-f785-4082-bdbd-6e83b5e945c2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8948bf25-ef67-4e04-b5cc-0676d2902c0f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a1b2ed4d-b1d9-46f5-9ac5-bcfe24ac17b1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'af018d2f-1b19-4c05-bb1b-e3ba79729175' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b9824876-8922-420a-83b0-ed79cb384146' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd1fea301-1555-4218-8ff6-6d1a81431386' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f405e8bd-cc39-4909-a7b6-e6fb1fa4a570' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bc93c38c-ac59-402e-8c03-b32457437ddf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6d45c6c5-756a-4765-aecc-cb5750ae9564' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '73925a53-790e-4820-996e-7f19f6127c98' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f300bf8f-ad69-454a-9d57-8a51a82fbe23' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6227d4a0-afc4-4057-9f52-3c4b956faa61' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7d0485f6-66d9-4460-a09c-c62235323fc4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '95d417f0-f1e1-41a8-97de-ddd4f1029fc7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a4600000-f707-4962-bf75-9db1a0908218' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '018893a1-67c3-4794-ab3f-7b7967f6ea0a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '06e9db54-61b9-428e-9605-60787924b7d5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '087eb8fd-b4a1-49a4-b1b3-562043a87e29' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '08fb287f-183e-4d5a-9841-edbb864c184e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ba088f3-5f84-463d-ad4a-2c1080c22972' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '10b46c09-321d-47d4-a4d6-96de21d14cc4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1c90a852-915c-451d-a320-5bf520e0918f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2fe6629b-1e21-44c6-b533-a188954d9e37' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '329d24e2-bd8b-4a63-9c75-1350dc854512' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '35feaa70-ecc8-4c10-8570-b613949b9761' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '36181779-788d-4c52-aa66-98ee188aea13' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3a1bcddd-24e6-4519-9b0b-f05271dbb46a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '40d322bd-3d50-47e5-afe1-74aeba5bb6dd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '42b8349e-f2b4-4d18-8982-7a55db9202cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '44f07601-fc46-4f66-b488-e9478ed7c4a9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '45405d70-e658-4f15-96b3-ebe70cf29997' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '468b7a04-985d-4afb-8f14-15aefe3b0045' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '48d6b562-710f-4775-bad3-3e783d010034' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4efde867-06a2-4c58-9095-048a60224154' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5112f766-55d1-4e76-bb05-a3f7abaa124b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '528df1ea-83a6-4a36-80ec-af8b9ac7fc28' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '534848eb-7f52-40b0-9126-3d70a58542da' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5380c7dc-3fe2-45f8-99ba-d8dae71f8249' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5599bf10-cc75-42d0-aa02-f9b9c66bc2ba' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5cb61d96-fa9c-46b5-af9b-4dc90364f29d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6462420a-a5e9-4d3b-8c02-69ba0d1df7f9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6bf55154-31cd-42b0-9d0e-95d81a120337' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6d2f5bcb-b3f0-48b0-a33b-a75c24858b57' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '71512d90-625b-40c5-810c-ec13d63d0098' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '716505cc-c788-4cd0-b0e1-966aa90d38af' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '740cc686-f5e6-48c4-9d5a-df0a69862010' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '799e1a8a-207c-446f-830d-c22bd535e27f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7a72a030-b45c-4bf8-ae84-8a1637eb3275' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7d29f385-be10-4c5f-a047-9dcbaef901e7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7d7a807f-44b7-46f8-bfd6-0dc883b6d4ec' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7f2735cb-b8a1-4383-8de8-896565e9495b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8032017f-9fde-4d36-a003-3b4c5a7d3a08' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '82a8f2fe-5727-40ed-892b-80ee97037011' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '82ea819c-4c12-4fde-931f-7b7af6568b44' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '86342fbc-6e90-4174-b453-75a76fd16d01' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8cca00dc-80b8-429d-ac99-5c9b2fd7e8f3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8e5a3291-0c31-4d3d-aa87-54e8fe13ac6e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '96da9adf-7647-4be2-9fae-a0e495d5b74b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a2c0eb9d-75c2-46c3-b11a-ffa9a10ae8de' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a78c1abd-012d-4093-b630-a582e2e26a6c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'aa233fb4-4d9b-413e-b13c-2d24e58bb167' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ab1bc256-856c-4118-bb86-1c3f460763c3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ba39f229-ea4f-45b0-a07d-660856a86b4f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bb8c6307-2efe-489f-b9f1-b8c7aed51d65' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bca7eb82-b228-4326-a07c-d6471ffe0c43' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bce42ede-721d-4921-bfe3-0f07dc08933a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bcf07d8b-bcb3-4ec0-9f12-c317f43244c8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c11679a0-c836-429a-b334-35b8c37c1ba3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c333f19f-f0fa-475f-8555-660cf4416e8b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c3f84217-8aa0-4194-bdf3-723010711fc1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cbf8f820-b747-4287-a26f-82c49994ef17' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cc32f5e7-3359-433c-8c58-45cfe482f24b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd0eebff7-f6ef-42ef-b474-8e09119e3aee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd600c025-51d6-4ea2-92b3-d9f1e6dd469f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd86ba8b5-21a7-45a9-b70c-47b4da5563b8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd9e253bc-d634-450b-b9da-af0660b3a16f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'db5a8ca8-cf85-48b8-a25f-33c0d8eea4ff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dd284dc7-3596-4fdb-83b9-9bfa7e48f577' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e42801f1-adf9-49fa-8a21-c15e1bcd00cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e527bf88-62e9-4730-98d7-0a2753ecf5ff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ebb2410e-9b4b-4f96-a62f-ece2ce7ee3f0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ec62d72a-1b71-4e0c-8f3a-1699b1c2106c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ec6d2539-13c3-4e1d-97c4-bdecabe342e9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ee2c9ea9-e2a0-4fcb-9a52-bce5bb6e8e87' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f017a9b5-f4df-4fdc-934b-57fe402fe988' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f4fa51d9-a576-4ea4-9f53-302405752399' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6e29b87b-0dc2-4527-99ae-666e3a50558a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '71b978c8-37e8-460d-8be6-fa9946cbeaee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a0509832-8623-413e-93a3-5e90adf1b0a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a586f214-7b2e-42f7-ab5a-903f320aa442' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a7d05a4d-f083-43bc-bd97-02422d9fbbe8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ac8b8798-2913-46c0-917d-7b82869e1ab1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ad540b2b-789b-4e6c-a9f9-287688c634b6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b76a2611-df3a-43f3-93ec-42d66c2094ca' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd53b3120-18fa-4e92-a48a-5cff9a1a3d3a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dd782d9f-07f1-4913-a528-b30dc0aa3a89' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dde77246-10ac-45c8-8f31-58dbcc5d9533' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2ef98db4-c5a2-4848-8759-a70308f7934b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4f895ebf-de85-425c-b9a1-118a55bcf70a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '90cf93c8-3e1d-4aea-9cff-ea442cc51515' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9d44b6b6-1827-45d1-8da4-2e3180b073bb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b5db5795-d9f6-4f1d-82eb-9b8efb66e4f7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dd91ceca-88df-4c03-a3df-c7764b00e978' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '03186e14-e351-4b8e-a753-f6984b852ed0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0583bc3b-0d7f-4b2a-a3e5-bb56e701e28b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '05a3c779-06a4-4ac6-b9db-8601352ea521' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0cabf534-b9c1-4181-84d6-1c7d95244e1a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1545d2c1-13da-4759-84b7-35c7e129d616' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '157567bd-b8cb-44f3-885d-47ad713bee24' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2d39846c-b821-41a1-8084-0c66077a28fa' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2ec07750-6d18-478d-8abd-eccfb0e44fa5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '44c3e865-431e-4e29-a045-3f190d5e712e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4f833267-2365-4da3-a68f-3e15a9736d81' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '500e4128-d435-4e85-a2d2-af932d51ec76' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '62d17f49-0510-494c-adaf-62ee14f58342' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '656b79e1-abf9-46c3-a940-f2471d778968' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6fe06105-c54f-423a-b06e-4ea3a3c0cd23' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '721bf10a-0918-4cd2-8e3f-05511a1473c1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '86bbc89f-884c-4ed3-8252-9f614b3da2e4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8f023e7b-f330-4207-a767-51ad2ed4b29b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9296e6b9-ad30-4a5d-8ae5-f7d9e394d150' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9769f7a6-2559-4f23-9a06-263f5bbcf341' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '98a152f5-465c-462a-9b88-1376df7dffcc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9d0b7bdc-a03c-4b6f-a7c5-99354103efd4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9db401a3-85d7-430e-ac49-27f968183a8f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c138fd5b-bca2-4209-9c63-c04d1f44f3ac' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c21f2042-8a3d-45ba-ab92-4645dd84416e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cb5d6c15-84ee-4d6a-b65c-c6530d4da038' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ce077597-708e-4599-a7db-7024314ba254' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd4e5681f-4b39-4152-8cb6-65c9458e2853' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fd298b60-f5dd-40a1-a5b2-bbe150409b32' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '088d4e30-75bf-4de6-9ab2-23415781b6be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2cf085ca-a0d6-4e47-ac10-bbf06467f7ac' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '342aa33a-f25a-415c-b24d-43c433de328b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '34f46db0-f4ea-4ad0-b288-539623f40fa3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4318cf27-39eb-409a-9e3c-7e726e3da4a8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '57fe5ed9-84f4-40c1-99c1-a7c12c5ca9cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '64377ecd-30d3-4a82-b9f3-7392e9b557e4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '68d67cba-7a33-4f57-8486-a3673288106e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7c9a763e-752f-4845-b4c5-3eb5fa069198' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7fc9542b-534b-44d5-989f-4b8a8e29403c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8969242c-336f-43a1-93f2-5958a9811e9d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '89f87e9c-119f-424b-945d-592c39bd88be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '90c43770-0120-41bb-98b5-4cfae165a0b0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b353a515-5045-4c97-a0f1-0f413f19d7d7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'be3298b0-8a6d-4a81-b6c0-308d64b2348f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bfe5cb20-1d50-4590-b435-275fc67c0e7c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c2743851-814e-4368-b2be-352faa9eaa8c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c898333c-5ba9-4eea-9394-5dee5896d15b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e632cdc9-49ad-4f45-9c76-7bc618598ce3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5c8d1490-406b-4beb-97d2-5946147545b3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8d6484e5-9d90-45b9-9da5-6503c0056ea2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8f26c1eb-8304-4403-9e70-7ee51cd08f4b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bf837641-ca9d-4be7-9092-2771088baae1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c933ee77-8f01-4b4b-80d0-c4748f998386' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e47f9e9e-f7a2-4671-a80c-a624d667eba3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e637816a-ed96-4705-8faa-dc18ffadb03e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'efa55040-c192-4752-972a-4f22d5fe83b9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '089b03b0-3984-482c-aabc-f0a36300f5a9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7e0439ee-6534-4da9-b576-58ca7714d128' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c358945f-6be2-4544-a478-4e61397bb4b8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0a0eee24-5ef7-45d3-9222-d5666f442fc0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6fdf45c5-95e8-4e11-be5a-abfc36156e3a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8449aaf7-baf7-40b0-84a6-3bbcb6f5c8f3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9b036ae7-ec5e-44f3-82b4-9945c492ac34' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd8afdfbe-8c90-4391-9c22-601d00170023' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '86e42585-fb69-4644-87a9-5a486b43b6d9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c004125a-48ac-4024-90de-59a61208ce26' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fce2533f-fb13-4406-ba29-98c1008496e0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0a86fa3c-c47d-476a-82f3-00e2ccd47275' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f9449b93-ff1d-4318-a7d9-8151320208fc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '03ad3c87-ac4c-4fb9-85dd-ee227321b4d6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '08945655-91e3-4d9c-99a9-64adcb03148d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0d1c812b-1c77-442d-b35a-c9b1961975d1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0db37202-e0a8-45fc-a907-bce69fa09574' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1e49dab0-a4ea-45bd-9947-fae9aeeaad23' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '221e7da2-4035-431a-9ac0-36d8a6c393b2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '333393c3-0879-4872-aad4-1740a653973f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3e291fea-418c-4026-a3e4-85de675d1597' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6906d267-bef7-4e0b-9755-b1d3fb4d492b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '690c930f-5888-4651-b435-9d5581c27d42' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7301c8bd-0f8d-42e8-9583-313f02935378' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '73caf87f-85c9-467a-8ff9-8ec779287c26' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7b006c43-1f38-4952-a6e7-0eefc0aa8459' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '89b8c1cc-0c34-4750-a856-83b236e6e250' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8a6185cd-c38a-4ac9-8752-0be428021d90' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '972a2d5c-5d46-45fa-8efa-94dc7957c231' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '97cfa0c7-6a37-4141-9cf9-004258ffa74f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9d9c2bb0-eb64-4612-b6b0-2264ebfaef6b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9eb41723-8e3f-4555-8c1f-6ad63696aabd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'acde69c3-b7fe-4d2c-a81b-dd86befec564' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b14487a7-b082-4197-a749-654abe93ed9c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ba7bbd47-789b-4164-81a5-09de4255c02b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'be5a3caf-8ed6-4ede-a6ca-19c64cf5e606' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cd18d773-d07f-4f50-9540-a545b64fb44e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dac01c1e-17d4-4d3a-9c0d-dc7c605502a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e792f618-4b56-4c21-84ab-e46589143d3e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e9d11601-9e3a-41a3-b5a4-5dc2a9ecb864' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f65a8fad-55a1-46bb-ac93-3001668a78c0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f95169fe-cad0-4fc1-a09e-b036de081127' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '01e5c168-a169-4c5b-ba00-7e142612c7ec' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0939e98a-d242-4364-895c-1bced9506743' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '362ace2f-9f22-4c94-9d36-b258c23fb950' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '45e9aba7-2705-48c1-9893-3481572fed64' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4682c165-4afb-439d-b960-211c41965ce6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '711fb0f9-48ac-40c4-a74d-126a9a2b23f2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '71de6dd3-a04c-4e07-bc08-e468e2fa59be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '849fea21-0d84-4d77-bdcd-7b1e6af7ffef' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '863cbf27-2731-4edc-ada2-8951b6401b68' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '937c2de1-11cc-4bc6-8fe3-59f9b483a762' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '95654297-2c23-484f-90ff-f3162afae2f0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '961170fc-7f2e-4871-aaa9-207c8a6d56c9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '97d40a58-db09-4f65-9d92-dc2181077168' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'aa58446e-58be-49d5-b3f7-acc1ada8e8cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b42e7c37-419e-45fe-b57b-d737e29b089f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b7fc8e5e-870b-42ad-8dad-1745e90b92cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ca888320-6ed0-4cbf-af14-200ceb189967' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd6cfac1b-8ede-4ac9-82d2-ee5dd1b33f40' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd7a2a58c-920b-4a76-8603-c60ebc30029a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd8fd322c-62c4-4b9f-8cec-e4c14f1021d7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e457ecab-bed9-4d34-96a7-182101229bb1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e6c64d56-1140-40f0-b79c-5dcf0157f9d0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ea14bd38-bd0f-4e60-90ed-1499850d5df6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f46ca4e9-e34a-43f0-83a9-ebf682543271' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'faed15b1-8193-44b8-9a6e-c6b7ac63e5b8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '171c43ec-2b5b-4552-9320-e4d4d22ca12e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '23ae1853-bb18-4436-86e3-9d8607f3e93b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '47e899f0-fcad-4398-819c-f9bcbf4deb62' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5858953f-86f8-424c-81fa-70663550f2eb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '78f0868b-511c-41e4-a4a9-8a2df5d8a581' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '87649705-fcc6-4e12-8ed0-6bc47d6ae404' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '905aa96f-6a00-44f1-8635-c5028fba617b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '94e44056-e70c-4c17-83a2-ff639d8b7d3e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a79c2cff-f3b8-4413-a742-81f093cb427a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a7ebe676-2334-4cb8-9232-f31fa86e7f9b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c11e638a-cfc8-4123-a64b-ab9e2fb05f6d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c70c469c-03a2-4902-b079-00e1fa8d4d39' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c87de723-6707-43f0-906c-215202666ba9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dfb99a9d-d862-409c-a351-32972b7f82e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f70fdd30-c7a2-4b5c-b777-50623071c0e0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fd2baf6f-dbe6-4e34-9060-be5b7678ad1c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0a273a2b-7312-45ee-a4c2-43a49edaeb4b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '439f99de-d45f-4b8c-8c3c-1204ed6c38f1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '971ef5c7-62c6-45dc-9cc7-0e1b71bcc62d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd880ecdc-d4b7-4b28-9f21-23cc2f8c93f2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f67148c2-c4f0-4f66-b181-65267f41d6be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0208dcc0-7766-46b8-a6c7-82cde7cb229c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '03f0843a-e9ff-4ac7-8e91-6e31517c7e88' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '09bbab29-48a3-4aa3-ba60-89c6b8a47682' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0c1c7237-575d-47f0-855f-1ca438cb3d5d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0e4e5806-c5f9-491f-8ff5-0641062bbcbe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0e71e6ab-12fd-4bd8-8b66-e6c02941d78b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ee197c8-a705-4cd8-a255-8eb6ac876c30' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0f4a1a86-8e11-4e94-b475-df8250360a0b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '122a8df0-3aa9-4638-b0e5-b9a34635ac7a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '188d9c9c-6de5-46ac-ac09-060463f98dbf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1c323853-cab5-4099-8ec0-a80b340bbed0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1c63675e-e38c-489c-b973-23467b3620bb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '205dbf10-f71c-4e7e-9b47-7fdc931b91a4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '218e3e65-a3b5-49be-8ed7-2f96b70699d0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '234c77b0-c415-4742-be5a-9ab20fa71d49' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '24b32aac-dac6-4309-a181-ea7de021e7a0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '251b0a19-60f2-432f-95ac-6260b5c9754c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '251e6746-d8ed-4797-94d9-ecd0d74d7923' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '25d133b1-7ac5-4346-bc08-ba4643b10996' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '26551806-b516-4dda-b5af-e2e89dbf3ef9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '278abe26-a8d9-4d09-80ce-3146fe908f4e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b0ae824-15c3-4544-8149-9a4c283b2d82' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2e600fc9-5104-4fd9-ab53-80e68836d27e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2f714386-4ad9-4ba8-a066-0e6032b6be53' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '30c4378c-69c8-43a0-a8f9-cf9ad336db61' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3149aee5-0bca-4393-a4aa-6e58d7b34b2a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '36849b8f-cb22-46da-8932-a5f731c53ea2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3c142edf-3eda-4d63-9cdd-7a5f576e0995' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3e1eafe1-5cd0-4008-8f11-23195d8c7493' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3eae79e0-3218-4471-b0e2-f75037b0b480' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '409ac687-895c-42d4-8876-58630c400311' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '433e7e14-49da-43cd-8430-c57e266dad0f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '438e1287-3087-4337-98f4-388ffd27296e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '47aa02e9-a879-4a36-b010-a5eed5120c12' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4b55b713-c540-416d-bb2b-def90bdb9909' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4dd7e5ac-d02a-42cf-be28-0308080e45ce' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4e5716a5-8dff-472a-bf73-b392886a3e50' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5099694b-2743-4b82-a012-b9593ad4ae0e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5326bfd6-b632-43e1-be1b-3a18949ee575' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '533dc5e3-ee43-4c40-912c-6fe68274c3c6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5573d461-4fde-4bb8-8218-375cda17db63' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '57f9058a-5174-478f-a787-6a8bfe791b72' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '585e3bf1-8885-4531-963d-d7634bd0e992' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5ac733f2-4458-4ec6-a8d5-0c72bd7576b7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5fcb260f-9567-4fed-a529-b9d986e58441' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6108c362-dafc-4fc3-96f6-29d9bfaf82a0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '62b605c0-879b-4c20-9351-cae9ddd9c6b0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '652bb384-bdf2-46ac-80a4-93942ff05a78' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '695847b7-2859-443f-8454-e3754bd5f570' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '70668ec7-922f-4850-9eea-4bfe8e56abae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7085d8aa-2a63-4c37-90c9-51a37db0b07d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '72b64874-e5bd-4563-98a0-ff95f4394a7e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7985e28f-4430-4603-9e48-bcc8026aa803' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '809e5369-af5e-4d3c-b198-22cd89a61870' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '80faf335-219a-4643-9da4-6415e27440df' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '827d05d8-60e4-4cb1-8e55-cc7bfec719d0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '83436962-7a0f-4cd7-b123-562b170dbf4e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '85c40411-3536-4ea6-ae0c-3616b9a3e596' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '87091f32-3fc1-4c14-baa1-bec7667d7aa7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8da1c364-7f67-4717-98aa-4c009c623e7e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8e3d50a9-ef08-456d-b90f-40af44e3c23d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8f58099a-b7a7-4b45-a59a-5279dc8f34dd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '991c02a0-b047-4c93-9719-bb1b50adada3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '999364da-a492-456b-a84c-886530b62947' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9c232c01-9ae0-4837-bf10-4d37b8b960a4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'adf5c4c6-998b-4c96-bdff-8f42617c9423' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'af270af5-738a-4d77-889e-957e0d7925a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'baff4a3a-725a-40db-952c-3c69b131548b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bdf939de-fbd8-4d26-942d-8fefba225afe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'be1875d1-ecdb-4c8b-9ce0-884fccca3cf4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c9dcca12-a6ef-4fbc-b562-b1f55b16efa2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cb5863dd-3160-43b2-8771-6d92f6d0ac40' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ce86210f-2b31-4f38-b134-40f2925590cc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ceabc1b8-c543-4102-bc31-070eac35367b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cf7a6920-9a3b-419d-82af-08c5bfbbb1f6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd5fb1627-05dc-4689-8244-9f6b52a39f7a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd6409c24-b43f-4702-b0bf-b5cef75329d0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ddddc6f2-8e19-4857-923e-aa9276a5e131' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e3637f29-be8c-453d-88bf-f38fdfcb5877' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e65c6c3f-9617-490e-939f-5e4c17dbe166' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ee97fd29-f030-45fe-bcae-8a677e72f348' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ee9f9114-fe37-4918-8705-766d62a986f0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fdabe2a2-4d22-41f3-a777-8d40193cd499' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ffe8773f-c7dd-4f9d-9dd4-71656ae13293' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8d0ac0db-4dc6-4f07-a597-4bcc1fd252e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a9429c83-b21d-4fbb-8d16-97a1c4dc329a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b0df71f1-f778-4c7c-aa1a-3ffa3e92d440' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bb1f42bb-a3e8-42ad-9376-7e57436c4f11' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e8d71dc6-e923-4c03-a07f-cf1c9f94e417' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0f3143b2-6607-4510-aa73-833d2389da89' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '277be633-f18c-430f-9491-0e37c9a102d8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7e86acf9-a95e-4b0b-9ffa-f6b88cb2ac2f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'af465ba7-a8f7-4d03-a3a1-4c0d4be044cc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c367a8a1-7131-49fa-a588-bdf5df15e824' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fb27a2b3-59ae-427c-bd35-5fb07f19d153' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '256a16c5-8a14-49f1-ad1c-e1c428430a30' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '40d81716-ba6e-4eb7-910e-24ca52e6d6a0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '42508107-8762-40ac-8211-3ea558cf5e05' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '45cded7b-6ed2-4581-ae9f-9accec0a5e6b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5df33a2c-7131-4876-b1e8-e49b7a458cf7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7aa9a2e2-ff1d-41cf-bf3d-f5331a4b0f51' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9a81d0fd-c512-4afd-85a0-222e2d983891' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cc8ad8b6-7cc9-4490-bbd3-d6799b911916' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a0cb4ce7-99ad-4f59-8731-a1bf55ad93ae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '08cb3e4b-7a02-40ef-8271-42ffc7b500ed' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1ea86357-39dc-4961-9566-3c51a698079a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '20614da8-1c42-432b-86cc-35a28d0073b8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '27dde177-6930-41ce-a70e-6080ba4c6b29' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '282902e9-054c-4a34-a9d3-6725f9c66724' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '286e062d-d0fc-499f-8ffd-ef348f78543b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '30fa737b-d33e-44ce-b07e-eb8171ccb618' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3f34c7be-9a72-43f1-96e1-869c2c631184' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '40ff3b1f-fcde-41fd-a60e-c262e1b8ce50' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '45afc89f-178a-475c-af26-c5f3fca6b0c7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4d80841c-bb4f-4445-b411-68496d0b83ee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5180f271-d429-4d83-acbd-5a057afd1413' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54b7317e-1717-4779-8815-0f7d982d4eea' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '599e8cc6-9921-4c52-86b2-52a5ccfe7ae7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '65411e6b-7afd-4a78-92ce-95d036475837' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6b2737d0-948f-4771-8dd8-9a617930f8c1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '72a1c2a3-9734-4a54-961c-6d608390044b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '73bd4a79-0eb9-430e-b7fd-afec7d0a1fb2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7408a6ef-77b6-4879-b57c-089230477260' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '765b9bda-a2d2-4b2a-8c5f-4c7ae15cc2e6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7c142c74-3e54-4167-ad9b-8f5d4a2d732e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7f4b7e3b-0a18-4afa-b3c7-8f0e081e95dc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8499cd34-6cff-4501-ab3a-5214ba1916f5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '880c5838-1ae6-47f4-8d31-b159100a82d4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '89e45f80-1f2c-4996-9959-f0442cd50284' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8fb148e7-4851-4a0d-b6a8-838ebda9d5e2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '91ef006d-5c2c-4955-963d-a2f6e809d1a0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9511799e-ba24-4fe7-98a4-95fa0199c8df' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a272f712-109a-4f87-b4da-075bf5a57312' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a46bd026-4b92-43be-ae85-f1b92baf41ab' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a5a3e86b-ed73-48ab-84e3-986915363436' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a7247157-3504-4a58-b36a-fcc032c5f7b4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'aa89a367-57a5-4b5f-bd96-1e4b361fca48' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'afd5f1f0-c1ca-4afc-8418-177e0d623b3b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b53142b6-b9f9-47dd-a809-20a9fd896a14' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b9f414e5-1eab-4db3-bd09-c17bf715c960' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ba6be8e2-b423-4717-8968-bac6dc13e2e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bd3adade-eb6a-4112-bd20-9b810099f2da' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'be242322-66fe-4831-acfc-41395063ade2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c12745e7-bac0-4e23-bf3c-8a963c924ef2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c1c9988c-e3c0-4ddb-884e-cb4a2acd5654' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c22cee74-b262-43cb-9417-5b8a1a7816ba' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c32ce4f7-9c7e-406d-857f-689a873999e7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cb78d81d-9a23-4af2-9907-d1bb0bd612df' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cbebb39f-cc14-4219-88f0-fd09add0a5cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cd27c3ed-21a4-402a-b275-be3de5f73e5f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd980fb37-e2b6-44ac-b0e5-9857322a1e0f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dd84cd3e-4f14-42ef-9ef1-432e277bf4b4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dfca4bca-af03-4582-9878-d0be99b3b226' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e43f3258-057b-42fa-910e-b461fb21d38f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e4ae08f5-88f5-4fc3-8adc-62d7543ef8ea' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e5c35151-57d2-4bd6-94f5-afb4094cb94d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e73827b2-a8b6-4ca3-a0ac-bdd6eafe1a2f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e9580b9e-d89f-4795-a7a1-4ec2ad0342c4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e9913678-ba0e-4789-94fc-fcd79bd2bea2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ef435a35-4bbd-4c9e-bad3-e658b6986d5c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'efc68cb5-a3fa-4bcd-9103-ebed5ba1886d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f11451cb-c647-4c13-b8b2-655e8d98e0ac' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f2672e31-f88e-49fb-89c6-6e6cea61a502' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f43e3bc3-db23-4067-aec2-c28ae539a524' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f4b4a04c-a80b-435e-987f-b63279583c85' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f5a16c5f-da65-4983-b2b5-ba6c914dadb9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f5a1b1c3-b869-48da-ad87-aa820095224e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fb299e31-42ba-4895-9e84-6ac9361a88cd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fb3bba54-80aa-462f-80ba-d9533577e059' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ffd9022b-f721-4dcc-a984-6c4b50d9e431' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1c69628c-13cc-4252-a5ce-6b7bbba4fc5d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2d17fd5a-7385-4cb0-b572-0e32c3a5b918' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '34644e29-3262-46f6-852c-7d750a0561a7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3effb838-39fe-4413-86ce-6e8f679198e6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6b8b302f-8be9-4f3c-a07a-016c520f47ca' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '75784ccc-0344-4f7f-a2d0-c0bd6e9d9beb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8dfd1127-bb2b-41f3-9c73-7eb2640cf917' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '95d2530d-3222-4ae3-9992-2ae30b5047ee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9696e575-de86-44f3-bcea-21acd1bd3c60' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b8a33e15-c17a-4893-8ff1-bd2847a4d4f8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ba2fcbe5-f59d-45a2-8492-111135e9b572' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bbfb610e-fa66-499c-961e-68796483f3e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c3f93b0e-2114-4e24-91a3-36d9829c3352' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c57d6b71-be10-42c0-9859-b7230e88ebd4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd846f20b-d7b5-4f79-ae45-e76c565fbfc7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ea146319-7550-418c-80d4-9c93d3346e18' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f11c1d7c-2c7c-456c-add5-f62fa95eee7a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f892408c-a313-432b-ba1f-3ea219507a6d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fdb1ab7e-0b0c-4b4e-af32-ad02f7af5a78' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fdbc1d30-b332-43b5-8023-7514f0a739cc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fe9a6478-3b44-4ea2-ac95-e6824afc38a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0413967e-550c-4183-8fe4-6e9823d982b9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0706a550-5f26-4f3f-826f-63388a4a6033' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b5f2dd3-dd9a-48c1-83b6-1bf9cb81f358' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3ff3024e-b315-47c3-839f-0b898de14cda' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '443497d9-b0df-4ceb-90c5-f1ced67a76af' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4685be98-e2ac-47ab-9c2c-e96bfcb02cd9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54096d64-2ea8-4001-8f78-0c96bd64a0a4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54e2db01-992e-4e5b-a37b-263840fbba94' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '702b33ce-9dd6-4996-a770-c9fba6bbe194' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '72bd069c-6281-43ad-8f37-27576aed31f4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8e999d01-6de9-44b2-92da-5bab08372cfe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '98ddc050-aa26-48bf-83fe-08166a170ee9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a753a7a3-dbea-47e5-b269-1919c26bf8d4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b30605b0-7c1d-40a6-adaf-cd9e47615f5f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bf3be1de-92da-42eb-8129-1fc512e465e7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '21442736-4aed-4108-a398-c15150cca729' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '61792da9-be13-4e43-b6f1-77ee24bdcf48' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '65e1e9f5-543a-434d-9f6a-e41760a68195' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a72d30c8-569a-421a-9284-ed71fc7a317e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bc762efb-5347-42bf-bfd3-2eeefb42e7f6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '020c2671-96b0-4f35-b41a-a1f88e2ab842' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '068b268e-3420-44eb-8801-b79a023dd806' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0a259f27-6be7-4a82-a058-44e3eaf5620e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0e0a6e88-a10b-425b-a6c2-96f76d042dad' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2ea007cc-317d-4856-b2a5-ab7bd55776d5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2f4c59ab-840d-41af-92b7-cc9ec26e7541' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '312b5c13-dca1-48ee-b997-2efb18f5179e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3e55ea75-a253-4ec9-a9bc-b1bc57c66834' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3e9dd7ea-9620-4184-be59-c23b4b279ebb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3ecc530a-787f-42c0-a922-0d911853bfaf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '42a0fbc2-7fb7-4e9d-be6c-b8f4f49518bd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '508b1def-bdca-4c68-80c3-5875a072a34b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '50ded004-b593-4a60-a570-93e3ae78c6be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '511be2b4-9421-42bd-a02b-1c1d864f9692' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '51e77c13-dcef-491d-b917-12324f249964' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '52b0aa08-3ac0-4115-991e-c54c4a142cc6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54137632-14b5-4a92-b997-aac105dfd4e7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6066bcdc-ae78-4c57-8e4b-dae69d28f6c4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6398095f-6837-4c02-9fce-41890c6dc6d6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '68103b5b-c838-4bef-8cb9-0458c0fe4280' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6ba2d0c1-f57b-457e-b4e8-e6961ef377cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6c361177-24f4-4fad-a673-a1231c143190' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '71ef37ae-c4ee-45d1-8353-67d969b6c6be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '75e4eee3-1398-44fb-ba80-6b10573e46a5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '78f1362a-e217-4bf6-9db3-1b690900a983' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7ae3e17b-6eaf-40c7-b6cb-7788df8d6bf3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7e829044-62fb-459b-b55a-9d8d7b4fcc10' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '89b959ca-1c13-442f-af41-1f54bfbc3871' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8d5cc24a-38c2-4413-814f-df9b9b4defef' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9bc412e4-4998-4961-8080-00613ce79a83' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9e9b475d-25ec-430c-bf8f-d6d040789f90' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a14103e9-c70c-49b6-b7c7-a3c0bd09e373' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a4044fa8-a6c9-431a-b386-7e7d82046e85' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a5abec9c-aa9e-4ac4-9d1f-3a7998317c3f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a907c3e2-4bfd-425c-87f2-6d4f8941475f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a9566e7d-c354-429d-b29d-cdf310227c6b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c36683c8-19c6-4ecc-a72d-4b7c2c722bff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c4e94a7d-8394-47ce-918d-fe5351f46dfb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c750b289-e7c9-4d35-a780-c2a8036d6602' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cb10182f-d4b9-4722-babd-c46df5f38170' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cd27bbe3-1a32-47ce-aa4e-b612e84f8be1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd29087c2-63e5-4515-b030-8d08bccaac87' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd481eb67-58eb-4629-b130-5a1012fb6eb0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd553adf5-2aa5-4d65-99e5-e60352204d74' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dada0cad-2b06-41d5-9e7d-f1ca0e55aaa9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'df548ac8-c8e0-4f5b-b6c4-f9c8e8cc6754' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e3080845-337b-4bbf-81e5-ad9b7bd83e67' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e606a42d-8eaf-4bec-97fb-eee005789f4c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'eac750f5-1637-40ca-859f-6b2b1de8bf93' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '111c5580-03c4-4260-b55e-e6651f1c74d2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3344d1b0-df4f-4545-b738-a7aac2f22f72' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3c479e16-f4e5-4069-b898-5f520676d1dc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '606f2542-a8ca-464c-a9b4-42500d6cb271' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '765b6741-28e5-4670-8473-c26655a78166' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8300d1a9-8359-4dda-89a7-1afecfcd2d9f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'afcc8714-d25f-44fe-8020-8f153e2a15d5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'eee9ac87-1235-4aaf-a0d0-2484c523a4da' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0364a790-544f-4412-b8a9-cdd68ce521a2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '07b01d45-b886-41da-a301-9a6d28efc65c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0bea6c32-bd93-4526-ab94-8dcb7a189831' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ca0dfe6-133b-43fe-b914-c78406023d8e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19c21f08-b8cf-4aa0-81ba-7622664b0ab0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19ca0458-df1b-42e1-beb2-b37b767a8b24' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '40b01ec5-d0a5-4a8d-9786-c30de7dfca16' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5933fa70-2222-4544-b247-52c135d9fc84' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5a1214fb-e787-4f2a-8fcc-5d1aca518959' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5d192f3e-5343-47fc-a143-b29659b277fb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7ac1b11a-786c-4e4c-98cf-51fef23b2e5c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7e6119b2-d7cf-4a5a-8196-68a7ec1ed204' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8ae22985-ddc5-48aa-82ea-697964e98d7a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cebffe48-7c50-481c-b94c-dd88290dfaa9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'db870689-3f66-42a5-866a-eed032c7a1a3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dc237a6a-cf0f-4850-9a0f-fe85e1715104' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dd4e8901-226d-412e-802b-c7cbaf23b0a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e137410e-1f57-4290-8e2f-e45400f402cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f572b0ef-06f1-4405-9efb-4dc11f2d1343' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0015c32f-494a-49cf-99c8-427c0d5a8fe9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '022ad2ed-c3e2-4532-b2d3-27777f5be8ba' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '441f3848-83ed-4c0f-9d11-48ebc0a2a872' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '56c21af4-2470-4ca2-96bd-e6c21a81fc7e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '72a91ac7-0c8d-4f25-84b4-4fc4ae919696' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8822e340-ca98-4aba-8e08-2546d30a7ce5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8a5180e4-68bb-4a7f-a982-9e7766defea8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a77d86ac-554a-4dc4-a432-acc01eb3444f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ae76467e-feb6-4750-a3f3-0bab882e1ee3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c84fc250-fc41-4fd8-9a8a-60bd0eaa1e10' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e50c2bab-223d-40fa-a23c-2a50279254f1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ec19ef7b-dfe5-44ba-8b38-bde54b26d38f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '187ab02b-3c2a-42d9-8efc-a876d545ce1b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19c8d815-a41b-46ae-b9b1-5d61cd1dc7e0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '284d117e-eee0-4b11-a1a1-bd3de46093a7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3c14588d-9ab9-4488-bfa2-538f9fbd8988' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '61141946-5263-43a4-80f0-806c693cff1c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '61f3d3c5-1d21-4a28-b23a-cbbe4d548268' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '629925ad-47ad-4959-a730-4018eedefa87' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '64c24a80-f8e4-49cc-a2ee-fade6443494c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '67180c3f-8c41-48c1-898d-7051f7efbfb0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6987c776-9ffd-416d-aeb3-a3a9d2e74102' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6a95bff6-fa36-44c3-acf4-312ae67190c5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6b620ad1-df3a-407b-8150-664063fc0613' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '72e54050-82d7-4781-b5f7-cdef76c6e437' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '79b58feb-48bc-4b6c-9cfd-8a3441b2b980' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7caf9f66-287b-48db-9cfb-65c1ff7e7f90' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7ccd38cc-0025-4978-a2bc-c5e1d21f10e8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7e2507c6-24f9-4a21-a06f-c58bf71f8c31' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '80ba755f-3236-409f-8495-d6d3aeb01a16' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8358040c-a8e7-4d3d-8232-4e4f414f2f6c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '83a4d726-d729-484e-b432-0d37dc877fb7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '865d764a-320f-4c1e-b998-10585679e426' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '88985424-81b1-421f-b410-479690004bc8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8de94bf0-e77e-4e7f-a944-8e6aeffe56bf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9be72b9f-2391-4eb1-81eb-0c3c504a61c6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a2a12ed6-e5eb-49ba-824b-b318d9535139' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a7db0374-b4e1-4f13-a0e1-f6bc4e953451' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b044fdc9-2d29-4190-a2d3-4c4ef7460edb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b48213f3-932b-42b2-a583-eacd24bcc3cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bdca26ec-9e9b-4b23-9d27-ddb16e73eb63' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c2450ad3-d015-48e4-841f-1c49dce250e4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c543a14e-9696-4e5b-a908-8c1b50bc98c5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c64c8ba0-f3ef-4b6d-bee2-598c915c900b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c720ff0c-093b-4c76-9a33-6ee5cfcd9fea' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cb346462-36b1-4a00-9e44-e14fead45b41' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cc27e952-f9a6-41e2-9459-299db588a646' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cd738d70-fb41-4e71-9019-20fc4f42a566' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ce3a881b-64d9-4aaa-9432-11783f157e54' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cf0f7600-ed03-4e7f-818c-68eabd9af1fc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd079e2c9-db08-4250-a13e-904680f60beb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd1fc41ee-61ba-4e0a-ab1d-6cbe06bc71e3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd21ea336-e9a2-4a8e-b9ab-8206ab4f7af3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd33d7443-2349-4c26-af58-eca6bf715b32' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd41be81d-4c1e-444c-93ba-63db7c69eee0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd4b05d44-74c8-49bf-aaa9-6231fbccccc4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd56a093c-eeb2-4237-97fe-6a94a3f8fefc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd60b0922-4bf3-49e8-b07a-c573942f7c28' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd7513243-f697-40f6-b536-3daae375fb9e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd998561d-a4e1-4e99-bc22-bbcb107cc844' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'da44962f-f9ff-4730-98c3-a7c21a9f0bed' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dc32dec3-2eb0-40b5-8b98-f061d705f909' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dc877f5b-dcbe-421a-8362-10ecc9822ceb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dd25dce2-1cb6-41c6-b34e-d68a4a27a565' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'df2393cd-7862-4e14-b00b-e990ee233c56' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e239d941-2c50-4cc6-99d5-d3ef06e79946' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e5deef3c-6017-4d55-a1db-da312f8e5be4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e9766ba2-cba8-4256-b4f8-4c4c6d4d7ea0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e98c6dd2-f846-4029-b630-bc65eba19e82' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ebf105a9-3831-45e1-9438-62a6b066747d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ec08cbc1-5f32-471f-bee8-f543231efb84' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ecd33b3e-4dac-4513-a9d5-f8db4a253434' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'edbb942a-64fa-4e15-a92d-9d9fa712bd52' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'edfbc0b7-951c-4579-be7b-9fc077659980' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ee7ec593-320f-4b88-8def-212bd2d937a0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f2c14b88-1ab2-4273-a0ee-30dde7052a3b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f365c92b-b7a5-473e-b5b7-756b53edd955' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f44f4b62-59c0-4efc-a1b7-53c0571039f9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f48715d6-9f0e-4923-a2e4-560e5603ea2e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f5807a3c-be2d-4a26-b9df-862712acc2e3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f5d96d7a-3b8e-4fd0-afb0-085799190e6d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f74c1f07-c4ab-4f69-a238-8ee149561d1a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f9d2f358-0639-42fc-8708-2c7927f4cf5f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fdc953f4-5d9e-4f8b-a9c9-50100e043a6c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fe6e51f4-1c92-47fb-89f7-0bc416ae6402' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ff298b9c-14f2-41d2-a75a-5053b5b50d32' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ff2eb254-0fcb-4f3e-b8be-80687947e789' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ff578222-7dd7-4477-bc4a-a3c494090fe5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '021e53c4-560f-4009-863b-63ad82a2a8c1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0687b551-b9a3-4f65-9406-b96a865f2c6b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '06afd41c-9b17-4e3a-8369-c0ea07380c4e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0778037d-9474-4ed5-82d9-c145f9731658' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '09a6b889-e9b4-4c82-857f-0572aac615b1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0a0c4700-b31a-4615-9e9c-477b30d6bcf9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0a33393b-3ce7-4251-8235-5865b962036a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0abae66a-aaa1-496f-baa7-a7a1edee7864' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ed6cd29-fa9f-497e-b5d8-ccfcc800657a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0fce91f0-e5d1-46ba-85c1-c81bc1fdb19f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '10571531-35a8-4e0d-af84-6a9e354eca7e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '10838508-6ef8-4c86-9179-2eebfb3ee6b7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '120b91d6-fe4a-4c5a-a789-01ebf123ca72' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '158d9f2d-61f0-495a-96e2-26e801e936f9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '169f3295-0b4d-445f-b16b-8f6dcaceeced' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '17f29d60-b54f-492c-bbcb-59675f3fb7fc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '18fbfb1d-d2ef-426a-b91f-2729f1e66b4c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1b5307e0-3adb-4bc0-a915-c4f26d426fc8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1bd72a6c-f25f-4284-a65e-15dbebb6ff64' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1c4fd2be-06f3-4c7e-924a-06b10d3b9db8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1c9fb9bf-8479-4133-9b02-b5da21af8766' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1d070e39-92ae-4eaf-afb6-81c91612e10b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1f68f5f2-f6b1-4a06-82e0-780b531c84cd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1fa981a7-89dd-48ad-ad48-56ecb7cf595b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '259ef51f-55f6-4b33-adff-7a804989268b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '25f8961c-da1b-41dd-9ae9-148cd8719f9d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '29b2eb0c-c454-4288-83a3-b52deafee9d1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2a77b782-7208-41ec-aba5-5a61808aed0a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2ae31753-f575-418f-a724-de579b96b09d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2daa680e-6534-4812-8a57-e76371f12560' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2e1ba22a-d7d8-4913-89d3-975268fb453a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '301793cc-5651-4f47-9fd4-a27836afad45' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '316647e4-253a-47c4-bc3d-03898de1bc76' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '33ec32a0-2ef6-4ffb-8bd4-076e32d5c176' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '34dd11fd-a3bf-41ed-87f7-87a6cc12af6f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '36d749f2-eb2f-498b-bc3e-73e60de53a9d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '37ab9778-64e3-43a2-931c-cb498d954037' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3a90a106-b3bb-4cba-a8e9-bc6a68ad4272' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3ec87ebd-e8d0-4cef-bdb1-0593bd82573c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '43360ae1-6ac9-4388-b660-beec36a91bad' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '433aeb0b-595d-47d9-a6a4-07f6780659d5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '452f5bff-2989-49c7-8cac-2aff41dbb13d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '461fbd63-d17c-4c33-8a1b-689e16acd62e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4969434d-fbbe-4676-afb3-d42cdc1b57a4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4a2f5c91-0517-4a14-8c50-0330d8f11802' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4ab3ce4d-d30d-449c-b060-315d227b810b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4cdea47f-1592-48ef-af21-72c24dc7623f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4e679c40-b1bd-40c5-b5f1-d372e406832b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '50eaca9b-8a91-474c-8912-522b44b98b73' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5155fb84-fbe4-4bb4-88a4-04fbb04f3b8c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '524436a7-0394-4039-b81a-fe6b937a524c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '57034a5f-0890-4311-b520-bfe2a6111049' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '57129b69-e54c-48ac-904a-9ac764ea70f5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '596a310e-e40d-479a-8448-8f7ad47069e4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5ad15c95-421a-49ea-b961-dee27c1d8895' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5ca82c66-0651-4700-9549-80c5be6335dc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5f51c509-ee11-4f8b-b9c2-48028ecc47f1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '630f97de-0be7-4ee2-9bf3-bc8e29cc318c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '634d696a-1205-463c-866c-75d39c5d9216' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6a04fc33-0e44-4c47-850e-d45fb1bc267f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '736394f5-e90d-4eb8-b6da-f2a8bf4ae0f5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '74da4a99-79c2-4303-b7be-9609c5b9f20a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8725720c-90cc-40f2-bbc0-4e5e8e04ddc7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '877e6c82-f148-47ae-821e-21b35ae38935' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '89c7ca4e-d1a4-4ee6-a5f0-ca190d14d39f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8aa5734f-2d68-4e55-b579-5903303b9727' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8c407ca3-1421-491a-9ead-a80c42d1575f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8ded77f0-340b-4c06-ad58-9b9c0faa49a0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8f728cfc-2380-4e1e-bfbc-bd3d55f060ee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '95ab075d-4509-4c8f-8202-a663e638e031' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '97d9691b-4c73-48e6-8021-b660af4156af' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9a0d0b90-d401-4b96-a910-de677625f5f1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9a4d4d41-acdc-45a0-af15-c2e90b33ec7c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9ce15605-4e19-45ff-8a40-16c9bb413647' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9df954dc-5d96-410d-9d78-90f556ed17eb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a65ff8be-23eb-46f4-9e69-aeb276668f8c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a6c645f9-f962-4f19-9441-91893c84dd84' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a83ff504-bf23-4761-964d-b76b6554943c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'acfe44e0-d501-4a8e-b060-40ac6f4ee25f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ae150853-7b49-4d58-8a6b-46c030dc9acb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b09a3e56-287d-400e-890c-9bde5cf6f5d1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b2435b62-4493-43ae-b8d1-ffa63159c5be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b355989a-9c60-4c5b-983c-6a94a89a0dbc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b4c58c41-6caf-4d94-9d4b-106dbda9af7f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b69ce299-03be-4a63-96f5-a5151bc4e260' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ba07ab80-1ce9-459b-b863-79deeccec1b4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ba79d243-ce0e-4f27-9d36-f26bc9f0f0ac' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'baf5be96-11ad-4ab9-91fc-ac2bb56ee2f9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bffd9a85-c7fe-4680-a849-c8fdf0064009' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c1c6dcda-5ab4-4aa6-917a-52b64e8e050a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1070ea87-79bf-4bce-8d04-3d16114e8e70' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '112392cf-72d5-47a0-adc8-2f7aa46bdccc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '12349443-77d9-4a34-bd63-c09005e5953d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '12741094-bbb5-434b-96d1-dd21c17cf8c8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '15c87d6f-013e-4424-8d43-c787d1ede093' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19126fbf-c590-4326-b14e-6a5e6038c06c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '217533ab-68f7-4949-813e-43a9a458c5c3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2402201d-d39c-46ff-805f-391c764a4a9c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2fdc183e-6b54-48a8-adea-98d0d56ec156' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3a3cd94d-ee76-4c85-bbb6-3eb6820bf150' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3d2d21a2-1925-47b4-b9de-3dc94b645330' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '44b50d5f-368a-421c-be36-c860a41ed838' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '50f033d0-97bb-4ad7-889c-31e77149b31b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '521c6f59-0295-4808-bd3c-2ec37c51d91b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6f29efee-c562-484a-b051-a736747a8345' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '707b2cf4-7c50-4958-8991-aac2832f049c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '77b4d2c8-0732-4fcc-98ef-5b3ad704e853' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7ab70c3e-e0bb-497a-ac38-d9090350126f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7e5fd113-dd7a-429b-a051-411e417969cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '96f31cae-a432-49c5-b6fd-d6b53184af2f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9a7275a5-e2c4-48a6-a503-98fbe1956bb2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9d008fc2-7704-46b6-9677-5e361d18249b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9f79b929-5ec7-4123-91cc-f649c2f420ec' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a10c544a-49f6-4f3e-9098-30d8c9424b4e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b603aa53-e252-40fc-9f50-2c7ec092d29c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b6b6ae13-39aa-4135-bc26-ccf7da84746f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bf21996e-8aa3-42cf-bec3-165cfddd6bf3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c0edf5c4-1962-46e2-b72a-8012b75182ce' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ceeb8539-cf1b-4499-b80c-4f5c6115477b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd33c7182-da27-4332-b491-a608a8587963' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd3ced4c0-7943-4172-a5cd-c16d0532e564' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'df59a29a-96d9-40be-9ff0-790aef37dd07' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e31b8dc2-41f2-41a5-9523-3fb9d0fbc23c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e3dc6607-9bbb-4a63-b0b0-2017cc34f0f3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'eb51a544-d932-48e5-8884-56bea26eea68' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fc9ad516-243a-47fe-91f4-3247fc43aa66' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '26492d91-e08c-4f95-9b29-2ca6868ba9bb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2712be93-6da8-484d-89a6-960dcfba9d90' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '30b22c3a-75b2-407f-ad08-b139c98b9c55' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '33d3dff4-7ad3-401f-be42-791381c5e3ef' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '69d64419-5883-4a08-9028-032a72e90372' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9ccde855-2f29-495c-8259-862dd2a78146' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a140661d-59ce-4d23-9cf4-9c307bb39824' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ae5d668f-d713-40d5-a48d-0c018d31a832' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bcae1cfd-aeba-45fa-86d8-a020b0ca87f4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'db8cc6de-9dc0-49cc-a5ab-6be4c58b5b37' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dcb78e3f-a01b-4471-adcc-1106acda0de4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e5151624-4c8a-4a45-bf9d-fcc62bff7b7a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4a5ed1bd-065b-497e-9570-c9aaf0187ffe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '799bf5fd-bca8-455a-94e5-486c4ecc6ad1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '917b63f1-c59f-40e3-950c-e0a195e69806' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '040bcab8-17eb-4657-834d-18fa3dc337ef' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '049132be-278f-4cec-868e-9bef7ea56647' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7e1a003c-9861-4bc8-8c68-d484d67a7663' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a643b0a7-c933-4617-b7df-e808a8eb3b0e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd6b31811-95d5-4952-a705-b94ee10ce781' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e9ce8ad7-321f-4558-8b49-2f08010f0a8f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0227f30b-f37a-4e2e-a313-da2fd7c64121' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0d538374-8117-499a-912c-6324d4adbfe2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0e3d0694-31a9-4b47-bf98-8784795d58ab' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '228e9182-e04e-4a45-a99c-009adc76deb7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '27e22a3a-450f-42a4-b563-2292dbaeec8e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '37c873f0-e046-4091-b233-be716f0f75bd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '38bdebe3-5370-4948-8565-c84e2628434c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3d21f676-0c0b-47a2-8f46-6a5d1d525a4a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '49a75621-2201-4d8f-a67a-3616ba872e95' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '50a8d905-68f4-4086-8948-c4e9c9dd2018' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '50b01db9-9e98-4446-9ffc-9740376c30e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '55cb7dda-3ec0-425e-b6b5-740c30a61aa7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5a72edb9-28b9-46c3-8bf2-e6cf7a19695e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '65070eb2-8f90-4583-b5db-d9d34b5c2dc8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '68b65302-e74b-49ad-a4ea-4a70d598573f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6b76b970-6969-4066-88f8-5551db742b9b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '74c3640f-39e0-4313-98b5-b3d70f906a22' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '813bb70d-7705-48ac-98f0-6565ec0913f8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '82c6619d-6ba8-4e24-86c0-d4474839d0f4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '93228db2-168b-46c5-a78d-0f6493eaded0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a366b896-473b-43df-b389-6e3f1745c5ed' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a67ee02d-c965-4739-ba48-c89030ebbfa9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'af7c97e6-973e-4b0c-a584-ae822ced3991' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b260340e-9b33-4be8-9763-bbade2ab8669' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c69a978f-a33e-438b-a810-df313efe177f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c8b7796c-fe71-4291-917a-211ac2c8e2b7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c9e18e53-bd1a-4447-bd2b-41f0f6fcba58' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cca1e2ad-18fe-4441-9513-15b938c4cf67' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd9e48469-60e8-4e09-8b3d-0555cf6fd291' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'db5b3e09-6904-4354-b371-0053211be17b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e55c8ed9-adcd-4148-b515-baf670f8e650' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e5ec325a-3789-4752-bb9d-d9817b7f7e25' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f0be630d-eea7-4ace-8d9c-b53748978bde' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f83fe164-2d35-4606-940a-0719bcf5bcff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fb306576-42a5-4077-8386-b56f148d1521' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1515120c-e7d8-4c4b-8754-2897b607f000' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1b971dac-f79c-41d8-be6e-b8709acd6f17' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '35cb2bb9-b4c9-4d46-b2a7-a96bbbce98ab' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6ba698ae-da13-419a-8a60-4e038873695e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8a4453dd-9660-465e-a84b-d4c099d8efde' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '906fcb3d-78d1-4e86-91dd-4c62f2407a59' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd7fc2bf4-391f-4031-94a9-e46e4f7d96bb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '332a0957-8278-4e70-876c-ec564cac9045' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3596a585-cbde-4fb3-a421-2ed3f6147e50' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ab135e85-d8a2-4295-8d68-314eabcb52a2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c2ae8114-0948-454d-b8f6-2a1d62b86def' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd29e37f4-c323-458d-aa61-9b483d64567c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e673e27c-0ab3-4215-a562-c54b5da72e39' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '34b61afc-0d15-48db-b043-8be9eea3cd97' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ed029a5e-5fc6-4292-8bca-e6405f4365ff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'db3469bb-52a2-4e01-88b8-2fd7f17e7e88' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dc0a8f6b-a3d9-48bd-bb88-8c08e22a1744' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e40d9824-2403-4b1b-b189-209181465ac6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e6f36aca-72b2-4d19-802d-a338bed7b36e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e816a360-4e77-4f80-b764-cb91cb72fbed' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e8e22d85-28ea-4ac0-82f4-536d4c1e050b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ea41d3e2-7fb9-460b-badd-845a4e5d70c3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f2093610-e57b-4df7-9c58-1af08210acc9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fcadccaa-3214-4956-b5e4-4ecd34d78659' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '117972b2-045b-4576-9101-d022201c2bc6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '87145fdd-1640-408a-885c-a92d79ac7878' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd887219e-7d7a-4003-8799-31699748e99c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7182a8b7-86e0-4a00-adbf-ccb8bf8f3a34' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '742a8c03-6b7a-4a26-bb82-089dea0cd84b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dbfd0f60-4231-42ed-bbe1-cb445f1ceb6b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0b1b9324-40ee-4391-ab1d-e6d554bb42e3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0cb90b77-743b-4e75-9823-4da86bf50257' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1cedc61f-20f1-4d5d-be48-7a90b7eb2baf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '252f861a-6c5e-4a17-9a67-035d000b4bc4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2eb8ef2e-fd39-4f9b-a8b7-faa3f704a905' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '310626a0-53d0-4558-84f5-5d1d07cee101' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4165c5b4-ec40-4ec5-a6d5-71f2b4fb43b4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '42cf50ba-84c5-4d05-9388-05e9db75fe4e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5ba5dd1a-1b28-4cbe-a456-0960757661bf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '670e903e-80da-4f5d-b911-d2d1550ce1e0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7772b566-4143-42df-b198-f25eb261886d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8735db42-730c-46b9-be7a-478f3efcec29' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8a859f97-e1c1-4baa-b8d4-91ff7d8aaab9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8d4f65b9-1e60-45f0-8440-167ef6a18d7c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8eed09b8-5288-4df6-a56c-c2a501f03194' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '906ec41f-6410-4727-897d-c92136956f65' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '933adf5b-8f7a-4aaa-bf8d-305559815952' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '959d7241-0a29-452d-9f61-4d933a6715a3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '97821ad9-d693-41e8-9269-7b2c6833ce57' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '990ba90c-8e8e-46b6-9d0c-7983de70947f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9d236c1f-c047-4b66-a822-8a9d61b403b1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9d9b1bfe-d51a-4f10-8940-09daed223f74' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a223e1a5-9e0c-4be9-8fb7-fedad078fa86' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a2c260a4-40b0-424d-a862-8ccf96d5772d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b407ec61-4a4e-4785-b815-5058b38ece0d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b6780850-2728-4713-a1b2-efd6ea194b10' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b6f37af6-8abc-460e-bb88-e8e01fb4dbf8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b77a6de2-8b39-495c-bfd8-0a9162fde00b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bc6271f3-b09f-436f-ada1-513c82f646de' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bc83176f-dbc0-41b7-aafb-44f1f9868013' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bd50587f-7421-467a-9cae-bc00066e79c5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bfed6144-6e9b-438d-aa63-a06ca1cb0eee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c441080b-cdbc-4a15-aad0-888c2fe3b5d4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c861931c-85fe-4dbe-b620-018aad3049b2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd3fecb37-05fe-4ef1-8b08-ba6319f2f61a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd4939f3b-7b96-4bcb-b2a6-ac16dd496292' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd7111a10-691c-4262-a999-86a82cc51c3c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e3ac2441-fb5c-457f-9d23-6770f125ddb8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'eaaf270a-346e-4bf5-868d-88edbfe4fd36' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'eaeddb97-5b1e-428e-bc7c-36466c81de07' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f0c8ad8a-73a2-4d03-909f-1e4e9d0107cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f59e5a3c-34aa-4870-ac0f-f98960ab9743' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fc9348a5-ca80-413e-9201-3216297f6402' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ff38dad3-2c6b-477f-8631-11e3709345f5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9175eba5-ed4f-443b-99d0-04fdf950155b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9338468f-5a2f-44d9-a661-191b5e3f674a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b86caeb9-434d-4402-85d0-3fc12e416109' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e1b10bde-09da-40b5-97d5-e333ad547224' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ef698211-828d-4432-9b1b-36edd2e3f927' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cfd85b9d-6046-467c-b3ff-8532bf5117cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0b766d6f-845d-4d3e-b907-977a1fd40a45' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '274e15db-0979-4053-8f62-a884c0d789ff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '34f26000-a301-4e5c-b162-6b416e0c5837' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3cb9d5b1-96d4-48a9-8ea8-dde26d99c6e9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4b6e1921-5c7d-4706-a32a-8528ff0f8d84' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8184599b-84f3-4b8f-98ae-ff9ca4d801da' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '88208053-b556-4565-a7d5-72bd40a0f55e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd685e504-b590-4ae0-ba62-08fb47b8f148' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '14ddea69-56f2-4dc8-bf2e-77b16127dd03' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2efa6be2-2eb3-481c-b580-cdd326e4885c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '39e5119f-f84a-47e1-982f-37ce261ec945' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '42491b09-4e11-4cba-b704-7c348a5dff78' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '43725372-086e-4370-9755-af3e92828504' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4f6e1d21-c142-4bbc-975d-2423ddb75709' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '51933f71-4834-4e4d-ba8d-a87ff7de1f44' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '525d4882-00f6-4fb1-a5ae-817ae8936fcb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '57a2ac22-ae92-4b2a-97e0-18c9bdc22d87' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6376ea7c-c943-46f6-bcef-919c1cb7cb5d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6736e4b4-0e2b-45bd-ac29-eaefa630a175' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6c610f94-ce26-4c59-8335-fe0b639a3f96' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8109cc93-007b-4a6c-9911-0037dfbc1a82' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9b6f344c-ec70-41eb-af90-c9a25c564d2c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bc41490d-6819-4be8-a39d-564a4a0f4888' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dffcf8b0-6c44-4bbd-a59f-5ddde344318d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e3f431bd-823a-48a6-9340-d926c9bc415e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0c110ac9-d3fd-40a4-a71f-9042722922ac' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '18b7bd24-85ec-45fe-92e0-59d0d827918b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '214852c7-01c1-4e60-a47a-f5b663fe36ad' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '24290fec-725a-4195-9730-8fbf70174b96' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '25987815-da1d-41d6-b6cb-5490d736db43' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '266b5365-bfca-4491-9a3f-d10ae3df4530' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2d970a0b-ef4c-4b54-aae9-343a912383ef' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '340c25ed-0797-4bcc-b9b7-54d74c2c534c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3f23ee66-c101-4a42-8480-eaf14b2a1e60' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4629340c-7a29-4332-9849-f8b702127bfa' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4bf861de-1525-457b-bdc4-34e59f88e9ea' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4ded45af-f2f9-461f-8fcf-b8cb409020a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54b95b5c-a368-4add-b1a8-e86733a69e7c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5c154938-1672-4dd5-9b3c-abd59a6499ed' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5cf8611f-7278-42e0-bd94-86e18f1616ee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5e1569bb-4949-416c-ab32-ae5cafc5c122' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5ef90334-1e2f-43ad-85f5-e4851996ff65' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '63d18733-fa2a-4a16-a7a9-49bfbfe68725' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6d0f4d84-6156-4d51-83c1-3a5a174206ff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '74a61236-5df3-4a91-87a1-338b8532c05c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '76eb56a9-1eed-4d14-aecb-135d2dab123d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7a74c5c9-ea02-4151-89e5-01d2296ef121' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '84ca119b-7e67-4294-a949-80ae41b15c0d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '86e4c8ff-89c1-434b-b988-1d2e595c1862' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '87835d9b-6a89-48a4-8933-20836d5511fa' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8c7acf46-88b2-4bb2-8f20-323a159a2a8d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8d0e2424-8390-4844-ab85-c8ce508689cc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8f060cb3-7193-41dc-a588-c97b5abdba98' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9348bec8-98a6-44c4-bdd0-a4c414dea538' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '967e85a1-a0a6-4abb-8538-0112cd49076b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9f051d53-081e-441d-ade8-2e966c90798e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a1b2897c-32d6-46e8-bd37-e6bd5fd62e20' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a63e133b-3191-4ae2-8be1-a914f61032e3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a66bc6a8-0500-4c25-82c2-7a9663fc9d99' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bbf17132-1e71-4137-9227-8f13ae10ac9f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd341d466-eee9-47af-ba66-c7f205018731' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd3c207ca-d6ca-488a-a031-984f270e16ef' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd9030bfc-ce9e-4681-b128-5fd2cfcc1af8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'de85c5ed-97c0-4cd7-ae2e-adab8b20cd77' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e57b6b3d-fcdc-4918-bae6-912e7f71f765' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e648aa3f-d830-43ea-8e14-f36b5a6c1736' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e981b7d6-c6b9-4cb7-a18d-eda0f9de10ab' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e9c1442b-ab2c-406e-8aa5-4864a39a73f5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'eeb85d38-cac8-4f13-86d8-384038444deb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f14002ce-4206-48ac-a138-a9d2c7e580bb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f314dc5b-890f-44c4-bc89-2984a1a1c00e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f7c3e8b9-2727-4077-b4c0-584daae49c27' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fd6b5411-5677-4326-ac5c-6b42679da36c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '76727f93-b718-47e9-9431-ef19773590f7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '21aabc8c-979d-4e99-9e35-96dc32936aa2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7d01e3f5-dee6-4d8f-b4ca-2f8fc5ca49fc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ebe9602e-9ad3-4f92-8dd4-5d2a735ce1be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0833bc40-0ed8-4d20-bdc8-5124b7f74f2d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '10d2d830-c89a-45a8-8899-986eef1932ec' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1a3219da-cc70-47d9-be29-26bcd0209dfb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1c51bd87-4229-4d6a-b134-3e7f90b6a7d0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1df5c190-27a5-4be3-b061-1f24fcff42a8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1f7937da-8ddb-4acd-b9af-beb60d39d422' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '289cd6d2-f87f-49d6-b079-30f088281f6e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b4cf568-9e50-4215-977d-92cff9972584' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2ecee67d-55f1-4398-aa9a-9a6dfd5ed743' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '31b870cc-b456-445d-975a-d1898ad3fc33' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '47c746b7-dc9a-4e67-89d5-b6a0e2894e72' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '50697ee3-fd75-4ef3-ac0b-e4172b44e96d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '53928538-b84a-4497-af3d-86ecb8d110a5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54fc7f89-39de-4b80-a8b3-6350db470732' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '56ab11c4-4665-40a9-9a58-5102f115b4a4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '58ba099a-0046-44c9-bf9c-5493a7303c2d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5e25d937-4277-4e17-9b6e-c871b8b3eafb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '65e5170f-6670-4055-a3cd-3e0e6d7b59f1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6b6e85a7-5495-44a1-9217-69b8eb98ef90' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '72d71d5d-592f-4193-9042-8ec540f472e4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '74e3b88f-6916-401d-8ee9-753fa45745fe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '766bab34-f929-44ec-b28f-2413593eaa86' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '786a8c1c-d6a5-4908-9356-70eb9d0646ad' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '82e9b28e-6f9c-4ab5-900f-5c0285084582' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8362a3ec-7de9-459b-8345-3a2f63c87e16' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '947e8e95-9b04-45bd-b2e7-c2a6d2d3ae60' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '95592ce5-026d-45c7-aebf-1d8ded90b1a3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '98841992-690d-4fa9-8474-1c56b61b0031' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a876b922-8a7e-4fdc-9d82-973144344bff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'aba2c3eb-26cf-48b1-a14d-d13313896f6f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ac668bda-667e-4be2-bec3-2474c334be61' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b40b7564-639f-4771-8923-3a5957cdc90f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bc0c8a5a-8453-4bcd-bc16-9a1fb27162bf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c91592d9-ac77-43b3-88a8-1c4329383f53' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd22a4bc8-4595-45e1-be3d-64722bdd2589' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'da7a34c1-3b89-4f61-97a9-04895bab0fbe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'def75572-e8f7-4ff7-b6e3-ace3fd6f2a45' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'df1b3c3c-b4d9-43c4-a3ee-7405000b6056' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e04950f2-54ef-4de3-975d-d28abdbe7a93' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e0902359-0bdd-4b3e-8b75-ed118c1d64f9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e2e72190-ceb7-4d00-bbe4-0eb88ea2c780' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e4c57685-85e6-4dcb-b167-f295da50debe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e984a6fe-fc73-4c56-b7f4-0856949e70a0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'edad2872-d13e-4e2a-95c3-3a9557cb96ae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f02e2937-15b2-4b98-a307-93f34914b152' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f250cc15-0145-4d93-84e0-141a39703496' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fc931baa-ea06-442c-80d8-e60d3fa71f41' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fd14e2af-64d5-473a-911a-52d3358a7b10' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fd464078-6dba-457d-987e-61b0eb9c1a88' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '13cb9187-6b6e-4c9f-a5a2-5aac7e833672' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '32cf6c40-b579-40d8-bcb4-40dcde605d30' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3a166a3d-93bb-4de6-a3ed-23a89a2c15f8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '94e7c4f1-c2b0-4df5-90c9-901f178be6ab' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c320f87d-9cd4-4c55-af22-c2e283714f3c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c9d861be-b126-451e-9749-59be90b609f8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd2913c5e-8054-46e7-94f0-67e5305f13e2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ffb48c1b-42e3-4ea9-9509-f127178b147a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1a1f128a-1471-4b6a-8f42-7302fd47de77' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '543147e6-cc2c-4c5c-bf20-8a158f2c6bf4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '72569760-2c5d-485c-a0b1-8c57e99013a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8a5e3bcb-7284-4f3d-8fa6-a419a5530b2d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9c1db147-98e5-4d0f-8ba6-70ad001f4d03' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a30ddf8a-7f51-4f13-976f-4468d04c4b21' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cb046f47-7ad6-4b60-b849-47e26994c040' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e37e618a-a360-4b01-b89b-139fe6dd705f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e71c92fb-19e6-4825-9fb7-2585d48cdbf2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1ad2de0d-0d9e-425d-ae8f-e63f2dfddf7e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b2edfa0-6f0b-4494-b324-39b759334d72' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '38c8d2d7-b807-4cbe-a3e1-a94d0cf03a61' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3b09b809-10c5-4cb3-9662-328ce317a3b1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6808394f-2eb6-43c7-93cf-a484dc937fe1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7adfb991-ba56-465a-b270-7b651116f9dd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7d631805-a5c7-403a-b8be-6861f7e4026e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '84853999-0d5b-4f69-a965-cdf68f647d63' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a48f229a-df45-495a-8247-f505831a4504' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a8dabc11-56ee-4b7c-a16b-73ec4e7582be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bbcd93ca-8fdc-4540-959f-4aedd43b1f45' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd0807f69-17e1-44a7-8a21-499cbf89c093' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd2a007d0-20b7-4708-98a0-dfc5f0240c29' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'edb6a683-627d-480c-bbcb-89c34bd9d476' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ef3c20ee-05f4-41ba-9870-ba0027cf474a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '01ea0eae-4ce1-4eaa-a470-39c954b51627' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '08edb995-8be4-4582-b81b-2a377d62d482' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0deb54c0-2a94-42d7-be4c-21e550146c94' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1bdbb0b9-ed24-4bb1-9c5a-ef3180214b23' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b907424-568d-49fe-8677-cd991806abc8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2e2fafbb-7664-4c38-89d1-4b044812b412' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '76083b6f-b8eb-4272-a744-88cd5db7f78a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7c372ff6-97f8-4c87-a398-a56f4be57583' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '89c57729-dd4e-4924-9900-c0bdb9771075' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd916d3a3-c0fe-4f23-bab3-64a82c54741c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f3c033f3-b9bb-431b-9368-ce5ba59feb76' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '15d48895-9ee5-4469-8507-58670981d031' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '173615d5-5723-4960-913c-336d778647e2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '18852a03-e88e-491c-9577-abf09d4582a8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '75e61a02-13cd-4f24-8ebb-3fd2d8b9bdca' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7fc53e2c-7f92-4795-809c-b250447ac81c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9a4e300a-b1d8-40f2-910d-81b5deb04cae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9a5b38cb-01db-43c0-9462-8474ac0ad386' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '229c0a7e-97ed-41b8-9d65-7d4f34ee66e6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '357ff21d-94d2-483e-bf2e-1237b5f3df9f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '59d3d9dd-1977-4172-be46-eb3fbca2f1e9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7d423301-06b1-49fb-89f2-f67e11621f59' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c74767a5-2123-4e82-bf37-899491c9fe98' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0825d46e-b185-4e60-bc81-b44cf2a02ec1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '13283bc7-670f-4edc-8c14-1671a06f42ce' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '229c9f8a-0863-4b35-b210-6d6c7f014661' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2e25d270-8714-4762-a908-f771ec8524f3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '38cd4cfc-0586-4a62-9cf5-92e9485d3364' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3e406f9e-ef99-446b-8c05-cb4e73c54482' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '405947b7-b647-44ed-929c-3233b2652f6b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '45b434e4-0b18-46fd-beb3-e71c22520197' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4799fa45-1fb5-44b5-bd4c-3d4c0ade669a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4c4a4fd9-aca7-4e90-9fcd-cc53da9f50f1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '512712fa-e623-414b-a139-16c68de806f7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '55f9b72b-ea23-4f53-8546-9e17237e0d2c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '61413486-e861-4785-9282-c45fcf8c681a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '67437e39-44df-47cf-be55-5cecfe569820' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6ab4aeb6-d878-4cac-8420-c922295ab145' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6bb3801c-ede8-48c2-aa1f-701128be6830' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '846056a1-15e3-41ae-ad40-70e9d36badea' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8a14a98b-397b-42a0-8f28-3fd50d34ef5b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8b843a60-cb13-4f72-a8fd-3d5617cfa910' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9131fc94-084e-480a-82e1-5d7d379059c6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a9e14f36-b25d-43fe-b0ac-c907d4bcde08' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b5dc5fa4-057c-4645-9aea-5562f58e2e75' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b6e5f1d8-550c-49ef-b6dc-100870a02b94' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b8cd9f11-5dae-42b3-9d87-1c73214b1c40' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c9d1d361-2e14-4cda-9829-411e762b4739' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd24f6158-ec4b-4366-b8b4-607ba0db990d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd3ea5c16-e134-4a8e-b52a-32552329b04e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd89e9fe6-b7f6-4677-82e0-8535f7b6dc64' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd8be5f47-51be-4260-a94e-c7d5b04c8d41' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e64e6c76-7bdf-4390-ac08-5cd885cda494' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ec781ef5-a4b9-4c6b-824c-741507743a94' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f2caa02f-5406-4799-b229-ffbf8f4ceade' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f4624a69-e0dc-4331-8a13-e6573781a653' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f65d1b89-eb61-45f2-9c7b-203df92aca40' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fc731f0a-8e57-4fcc-9790-d4b7935b7a47' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ff4e0c6b-bbda-45a0-8903-f4d08165bc38' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0fe133ba-37ed-4766-9234-b88ad4d80860' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '10fca995-f0ad-477b-931c-d1f08f9bd4ba' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '195ce41f-0d62-44cb-baa5-59bd5ee46729' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19bdd8db-d13f-432a-b4ba-9181e4c118ee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '242a9f1f-b9b9-4f06-9aa7-efb27b90f159' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2c584a17-8880-430c-84a1-ed448f3a2de3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '30db7bb8-cf7c-4e21-839c-a137736d21ce' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '34eca0e0-8760-4937-b93b-72eb16095b76' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '364f1e58-0792-4988-8d50-b2b2ef6d2769' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '38c623d2-777d-4718-bd65-c78fbd1e9d71' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '516aaa2f-418b-4c43-951f-39f1ae11b94c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '564cfb40-9bcd-4102-9f59-3f829f600f64' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '70cfb41d-4d4a-4ef4-9873-663b202c61f9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '76ac0c1c-c59a-4116-ab99-c876fde14552' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '82064f3a-8e1f-4b44-a651-3603625400e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '85af50dc-4543-4911-95e8-775016053378' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '87b1d9f9-cedc-47d4-898d-184d5c11e523' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '888ebe55-095d-40aa-9c45-231d9fa9c4a3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9cba8c9e-a88a-4382-9d80-7e05da873726' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'af5f6319-4504-4714-99b0-06b20bb884de' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b552e45a-83d3-4fa0-9c56-699e3c6d2d6d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ba4acc57-44c3-4f1c-a785-f8e15a4a2a1b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd604260f-523a-42c8-85fb-7ce2c2c69b6c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ddd2e333-0ce6-4a63-8ffd-f9dc7a43e201' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ea0a1d95-dfd0-404d-8709-6c2d262ebcd2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fb761987-4ffd-42a6-ad68-c290da42bca1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1aa91c36-83f4-443c-ba24-27014cdf3e25' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c40a7705-e542-4580-8848-1767d449588d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f8a59455-6db6-48d2-9b92-67e614332ea9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '080d7e32-56b9-43af-b326-ebf623c9dd23' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ad03762-7d4f-457b-9e5e-04ce0b86c67f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '120004d8-ac20-4e8a-84e6-2f298f1970ac' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '12391610-f51f-427e-930c-43a62dbfd9ee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '15ffc41a-0bf3-417c-a479-68866ff44b9d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '17155db8-cafe-46ea-a977-a7b719a9beda' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '235014c6-cc84-4fac-9fb1-9e74fd478d38' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '25814529-a815-48cf-b9bb-6105774c65da' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '30b591cd-8324-474c-99d8-df273de716dd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3b40eb14-c5a5-4522-92a2-f134842cc36a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '573ef3a2-4460-4876-87f6-efb8288a44a2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5d669242-aa14-406b-8e14-d15f6593eef5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '618e49c5-08fb-4f81-8b4f-de652ecf52c6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '71add01c-6898-4e69-ad7f-96af43ff6fbf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7c1932ff-8413-4e9f-81bd-603bb3f7f5ce' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7e5efa0e-73ba-469f-aa39-d8fbc655dedc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8c3e5fad-9bf4-4555-bc85-1b55066f3e44' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b51b9cdd-dd81-469a-a79f-d3101f0f269b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b894d049-a3dc-479b-abed-f5137f4e3f7f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c63edeac-0cb7-40fa-91a2-3b967729d142' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e62f218b-8b85-4cb8-a8af-0d4392e5f008' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'eabe69fb-9991-46f6-98ae-401c0b8b9894' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0738c0bd-e3ad-43ab-a988-7ad98eaba672' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '08368bed-0be5-4d93-ac83-7aa9802467c9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '279a528b-a14b-4247-9d1f-05a2a66a2dad' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '33e7d28f-2a05-4b6e-9c81-2976a6d0b2bf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4bce1c88-d660-4555-84f1-5ece83b4adc6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '55d90897-e31d-44e6-8322-4e544e612162' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '55f52f5c-7f20-49d9-acf4-8d4ea8657155' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6107c177-3b86-4aa7-b02e-b4c1c403c86d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '67dd8311-7859-4364-a7c1-c12337c20c47' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7441902c-cda2-4729-bf3f-d0945cad17e9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '79136624-39f2-49d8-9ce1-e02c64779bc2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '799c6c47-5a4f-4b7a-b7cd-8d8810768733' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7fba40ef-e799-40d8-8d31-0d9ffd8bb043' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '81530922-6e6e-4e7b-ab54-0ba78d186bf0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8369b2b0-7e35-42dc-831d-84b9739498df' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '90dd34d5-273b-4408-9bfd-09c18882a07a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '97c48afd-7890-4627-940d-cc7dfc5a9831' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9f6c1c97-439c-4589-80ad-45202b1ae61b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a50827ef-e663-409e-9a53-936ff3b18bbb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ab8fb727-0f7b-4ff9-b48a-91a4324b6515' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c1852c1d-9799-4691-82f9-c8d19f4cfb93' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c48a28ab-6bcc-4f99-ae01-cea5893dc126' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c65ea1f9-0f62-48ae-9cc2-0b7700769f8b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c8f2f484-5bab-403b-83f6-ad0bfd014743' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cf54eeb3-da72-4bad-ae51-1904d1283242' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd0386501-53d7-4213-b04b-b686bf2382e4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd2c1fe02-2e4d-451f-8d80-898aab95bf7e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd73f0786-3467-427d-b8bd-f522b20dbf81' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd91add90-014f-4688-8b2c-449d3190e0f0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'da9b5893-bb52-467f-8846-86c87a60889d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'def577c1-4463-404e-8514-9dd0b1b504cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'eaa98325-c3c3-4611-91ad-74b4dfe558f3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f35890f1-4c4c-45e5-b3a2-cd6c2372b56b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f97db099-ed39-4a5b-ab9e-df1552765907' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f9d87c6b-ad4c-4f03-b6b8-1206a757a404' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0168d500-6ee4-40c1-9dea-e930d900430e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1fb95c71-e224-4465-b499-a619e0c71385' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '48a84829-8154-46fb-a486-e2752baf408f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '764d36e7-7a08-4d02-8a0d-e0b7682e1051' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7b06958b-933b-4598-b661-2c0e4ccfe71d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a08af34e-5107-438a-8251-1c047a10d05d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a3d759aa-c631-4a3e-99f1-d1a6c973ae3b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'aef7fca3-267d-4660-8901-9935f17ad28a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b5ded2dc-752a-4835-85fe-ddeb6970f9f6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bc41f80d-a066-4cec-99cd-2a99cceb3ae9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e862cbb4-401d-4183-be62-02fd12708a70' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ea89434b-7117-4353-9d55-06e3127adc04' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0566a814-6e81-4e27-97c3-94f855901d92' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '09f1999d-56ab-4dae-be37-77c25a61f875' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '110d1237-8cca-462a-8f27-b694a31bd76f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '21d72987-d980-41e0-8464-523418dec848' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '282490ea-f395-49d3-bf66-6e23caa9bff5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b31d56c-1dc1-4994-9ed9-fc104806ba15' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '411cb58f-1c6a-4638-95c5-d5c9bbc28208' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4651a107-41eb-4005-8036-cf49e6263250' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4cd99aa5-d44a-4257-b694-c83076b7aef1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54135cb2-7ebc-48e2-b641-b3411350aae4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '55794f6b-ea94-4ab1-99aa-26af0ad9abe2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '62f7e8c4-7c49-49bb-9a15-2c38ce9dd0b3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '66e8065b-8b92-40cf-a4ce-2e66decb48df' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '72981e7e-9fd4-4015-872f-0a9752716348' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '80bdcd4d-a411-42bd-8cba-32fa4d78036c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '84fc293e-6bcc-484b-a172-3ee6bd087245' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '89e3018a-ad14-415d-accf-d6ce1063dc96' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '99835df1-ec15-4ec7-a9b6-82845365dbbc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9d4b07b4-d0f7-42b6-820c-173a8f0a0d64' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a00fac36-6187-435f-9a85-b3b6c6c5dc43' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a500c191-512b-4d24-be3c-365b078b36a5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a6b28ff2-8f28-4766-8f09-3eb33d001a4f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ac5b1226-15c7-4165-abf4-f590a4001a59' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b16aec75-2495-467b-83bf-6a2aebb1124d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b54f3b03-af19-47ad-91f0-9a05126318a9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bf0b6c76-f300-4122-955b-1936d5dad228' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c352d4b9-2b4b-4b00-b32d-4d78f772a8d8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c5c0be7e-6eef-43b1-bf46-aa2699318d0a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ca086c12-b0c0-4d95-85e0-f8528465ee42' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e471c12a-35db-4afa-8d9b-b7ac3cfd5beb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e5519519-49e0-4f20-92d4-532178164fa7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f9124fa2-1e47-48e0-ae0a-7165cbc776ec' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fe47ea56-7a3d-431c-bb6a-e2bc3b5b3b0b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0a4e14de-7a46-46a1-9a3c-505800b729ac' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ed0f406-f98f-44c4-a326-d3e4f49681e1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '13cef5b8-63e0-42e7-86f4-f5a8e9b07568' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '16af573c-ba5c-4c1b-a98f-6ced8bd06619' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2e58b963-4474-414d-937e-f257e2c2402a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '53003c82-841c-494d-bd1d-ecc4970dca72' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '70162845-20a2-4880-a707-7760770abd85' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '794ffdd0-c9a9-4dd0-b052-650335caca08' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '825a0801-f57c-42c7-9558-5cb1396990b5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '88e9d7df-d59b-4600-b84e-d456dcbe4bd5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8e08e2ea-d32c-4436-9515-218b6d9d7fb3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9217e8a0-7134-41b9-a063-36ae19b970a1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9e636173-ea84-424d-9887-178d68255625' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b50a0364-be5d-4a21-94c0-d1ce4543d51c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f4142971-938c-4d97-a1eb-df0f48f2e36c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f7c98ab6-8978-4d80-85e9-2a979fc59968' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f8064a5e-8b5e-4c17-91fe-369959229b4a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f817346f-e74f-45ea-b1bb-21bae5954055' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4410d56f-ce03-4a84-bc2c-3939e250cf2e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2c0f7031-7d23-4d98-a507-884c795834a4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4d4a443e-5318-4f03-8644-9b9ffd0e10c9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6402f7d3-df7b-4f52-b0a4-fa7038c1a8d7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '662090c1-fd83-453a-a458-bc811c9d01fb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '67f5d6c0-4eb6-4a95-8f80-a94b00964255' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '801fb93d-7512-489b-a17e-f42bbd5dd4cc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8659d96d-2342-42cf-8beb-a3e543036728' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'de1de6a6-a1e9-4f93-9122-0fad6d434432' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e0a078c5-b990-4a53-9efc-2efc8ab616e0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f49f3c2e-1232-4216-9d85-6a21fcd6be4b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '05a39e34-df2d-4422-92f4-8a949bb2a7d7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '075045b6-33f0-4c85-8fa6-838f2edd9dbb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0882f16a-5773-44b6-8096-7430613f32ee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '096f10c2-8e1e-4ce1-a615-679909ec8891' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0a04f776-5980-4d07-a564-6ff1738ddb64' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '142eacf7-db8d-4d35-b51d-fd98297a6870' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1867f957-c224-4915-be76-a05bc2a37fbb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '18cc91f7-3f45-48c6-b828-4b67291a6b47' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1c9673b4-9391-4842-a0ef-c12a4a8ff59a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1feb78b8-ce86-4fad-b93d-afd515b7ea8c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2713adcb-ebc6-4da6-8034-96077c1f6ee0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2e6221c5-1490-4d4d-9fd4-b3f8d2d97dfe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3400f949-4ff2-46a6-a702-5997d4301386' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3e3bbaf2-8499-4391-995e-1482182bd8e2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '40a46bd1-4469-4c30-ade1-09d4ebabf2f6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '40f05e30-a88c-4c1d-ae0c-218c6c8da151' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4f2d72aa-63c8-40a7-8f28-9d4b341bd42f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4ff00017-9851-4337-8e66-c0fff561c20c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '509f3be8-6054-4fa1-9d8c-0aa1d560c314' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '58c82271-1208-42a7-9fa6-baadd2ee10d4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '59fe5266-5f31-4d7f-be9b-73f531f95ec2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5aa03465-803c-45fd-9be8-8ee86263b551' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5aac4025-fbbb-4aa9-81b7-c5b715357abf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5e8530ba-ce52-4855-ad3c-86939873273c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '67543808-4559-47c5-a4ec-7ab984e0821f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '67f8bce5-5a47-44d8-9b13-af5899fbb8cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '734cedc4-f06e-4448-bd57-23333934f067' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '760abca1-f443-43b5-8680-1399a1f083f1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7785ffa1-8658-4906-a9cb-9a4fbebbee24' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8144b094-8d60-4933-bad9-23d45d10572c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8e564bc4-ce73-48c2-aabf-4f52071d4b55' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9d40ce34-f1f2-4e24-a107-3ce3e93b2d56' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9d9ac4da-0a5b-4382-9636-7cdb64884cc4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9ea48007-288b-4477-9cbe-55d23b1a6179' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a4a30803-85ea-48da-a803-d77af7c601a2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a533bd26-c5f9-427a-8593-40f4fa775517' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b452a3c2-549f-4661-8cc5-35dcc19ffbc8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b5fde60a-46e5-4919-b7dc-f7dcd43e1ae5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b86f0a74-9fc4-4dea-8c6e-0044e0bd98cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c56e06a8-7591-4172-9554-ea7db6f4882c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cab6d587-cefc-42e5-9895-6ee2d6f89cb1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cc7e422f-cb42-4f43-a419-c5cc1242a807' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd210d37b-3b6f-4d3f-b9e9-f7fef003f675' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dde9d48f-1829-460a-8c29-70440b499602' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e8892d82-c896-4839-9064-f08f881ca800' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e8f7904e-2906-491e-b568-74ac4d3117c3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ea909a40-ffe2-4f45-aa86-839610db5bc6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ed3c6ede-aabc-49d5-bd87-db2a58a8f547' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f0b0aa69-08b7-4984-a294-d12ab11bc793' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fc3c05d7-fbf9-4fad-994e-6569c846089a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'febb75d0-2b56-4602-8a7c-07c55c1d00f9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '80ddc232-d031-4900-a0f3-b08b6c5e3ea5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ceb84469-5e4a-4982-a826-b2fa333ea2b8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ff36fd5f-674f-43c0-82fd-6fe8bf4429f8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'db1415ab-c60c-4725-8b64-a34630556e66' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2832baf4-82ad-4362-8b51-634e993654a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '43e7b1f3-d212-4bab-904f-ba797084d76a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '52557110-c716-402e-9baa-ada4a0cc212b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5e63a28f-f178-4216-9298-879d222b95ca' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '68e08c7d-610f-44a7-a187-1608212903d3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7f38a322-57b0-45e0-950b-600627494ab6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '85eda11a-08d5-4b84-ac96-0f2b18b4629f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b8eca05c-d71a-4d14-8546-6a444bae8f85' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bfe2b8d3-1618-4781-b122-eceac9f27b45' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fd38be2b-2f5d-4b6b-866d-343e39d078e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '070a13dd-a34e-4a2a-b64c-f1d058c46b2c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '10a33ff7-c2d5-4f70-82c9-331b0b46434a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '227134f3-e7a4-449a-9333-8666bb3565c1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3011a810-aa43-42ef-98e1-3e6ccd7352a3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '33ac1a61-1d18-43cc-bcb3-471efa331708' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3538ce02-731e-4ed2-a34a-e0a47d6421a7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3c6b8332-636c-41cd-a535-74b184d28063' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3cbb3169-0051-4d3b-b95c-836cbbda7671' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '40652a12-ac56-4006-9832-b7295c60445d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4a579078-c108-4058-8ac3-eb004cca34db' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '504919fb-1e94-4001-a4f0-ecfeab789ab4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '66885ed2-7bc1-4cea-98bd-dc78c63ce591' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7061bff8-e690-48bc-b249-326589695209' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a7274b25-5cec-4686-b885-d7a6b82849b8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ac2b49ca-0c96-4c2f-b441-c160a2d23e52' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd0c5beaa-cd66-4b9e-9d5a-a8eca3027901' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e2a41e25-044a-4a08-8f26-35f4510515a0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '07269fbe-2ff2-4d7b-b007-f8106c73614d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0bba018f-614b-4b30-aa1f-0b899fae096d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19bd83f4-5d17-4b23-8aba-d045a426083f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1f7c1479-cd65-4312-a295-5710612250d9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '28388343-99a9-438a-a927-fb3f8123cf54' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2aebd5d3-36aa-4cda-b7f6-ddd211fa58cd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b152bb5-b6f0-4041-bc83-7662252e18ff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '389fdcfd-495c-4309-bf27-6a5d897bada3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '39cde3d0-93a1-4d65-b8da-fe0ae9741945' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3a474ecf-2e0f-4e12-a325-31460977d9c0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3b416c63-3b50-456e-b4b4-44b4382b1148' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '45d5d1fa-2310-4355-92ea-1421debb1d0a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4696c4cc-87de-452b-94c4-fe401d84704b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '472eea63-efde-446e-ba32-363fdb53ab32' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4740d590-a5a8-49fb-a6e1-42df6cce6c52' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '47bb8ae7-2d0a-4204-93b4-7fbbf450a86a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '47d5a82f-8304-4322-b686-14b25c86eb7c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4883533c-87dc-4585-b8ac-51bc94f9e884' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '49b91797-8c28-42bf-9d47-faa6a23dfb12' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4c76115d-85b2-4db9-bd97-06bd2250f9e0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '50d2969b-ca2e-4bbc-9015-7e5c9f287bfe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5341da3f-f295-4e7f-9cc4-5a6213bd7339' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '538fcc9b-5be9-4701-842a-3f97c055f29c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '546f01f2-62a9-4e02-a7e8-25ac169d64c7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54f39f61-4f5c-4a8e-a9d1-271299f1c5aa' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '60b2cf3b-40ac-4ae7-bd05-2c60e677bd2c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '62b3bcb4-0f36-41ac-96f3-99e4ab905b5e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '69c11089-39a1-4867-9111-53bcc2d51dd8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6df5b797-dc82-479f-a0a0-785f953d5f6f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6fffb3a8-c8c2-4cc3-ab9d-c57cac75f706' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '71b6919e-7456-4e55-a143-79726224d6db' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7549bff9-3636-46c0-bcbc-c4ebaceb7820' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '75d51f9d-dfa1-4483-848a-eb3a082b9a4f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '76857563-09de-4f39-8e87-fd5479820cad' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '76dcef15-32d9-4f37-b628-1d42772d68a8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7ac40fb4-8682-4bb7-a800-9718c200835a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '826e0bca-4e07-4422-a785-a89a6959e35b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '83931cfd-80e9-49a7-902f-b7d32b665dc9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '858ceb16-4625-45a6-b656-700be23e530a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '94d39451-929f-4b31-b219-dbc59c8c9d8e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9563a708-0f8d-4820-beac-56289188b0c9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9db06121-5cb6-4e3a-829e-b08d5068206d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9dd3d69f-e3aa-4eb0-9a07-df67010af40c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9f01f454-a905-4dc7-a7f2-e00c0c986a9a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a0e82ce2-7e96-49d3-8cd0-23515ba642f4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a56572a9-ef8b-4c16-a998-0e4271ad3614' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ab9bdba3-29c0-4d7a-864b-19c8db3e8c50' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b02581c1-f0b1-41fc-a4e0-53152c9cee76' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b0aa12f3-d346-4218-822b-5db7add58c48' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b1f306be-1db9-46dd-a150-97a8be32371f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b41bd3ef-3d5a-4de5-9bf0-b6ea0e980e3a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b856447d-c772-4f67-a0f4-adaa2792dab3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c32c5c06-3ffc-4e55-9a23-0b769c656bc9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c3f7d662-2ed6-4c70-8287-4af9936c795d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c9249eed-1348-4284-bfc1-0daae000f9be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cd0c06dc-af77-4022-afae-4973cda8c307' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cfc0a236-9358-4296-84d3-db92c00a0553' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd1335d88-2887-4e1c-95a9-ef3f2c121adc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd1f9f9f7-c459-475b-a5a4-d73bc1d43367' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd5100649-e15a-41ca-99ff-6f77328bc6a5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd5d7980b-1dee-4458-96a2-48bbc752e070' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd6a5fac4-b4fb-4fbe-b2d0-d4339a07df89' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd86c6210-e502-40f2-aa8a-ebccae04785e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'daca160f-0558-4bfa-b97a-33a171bdf810' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dcd91b6b-2b76-48db-b8af-a395a218c0ea' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e0564e91-7a83-4a67-b481-7bea9df03cf9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ee215478-e5ba-45f4-8c1d-97b781ae6250' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ef21386b-5913-4e90-8a61-fecacc27e5f2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f18f9e97-2c23-4f2e-acb7-e8483b0c97fd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f3978a54-4bcf-433a-abfc-3a719ee23aba' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f7a47fca-b84e-4433-a872-12dc0d3365c2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0514611c-732b-4dff-9e46-369003c7d376' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0a544ce4-31e7-430f-b7a1-df105c8030d7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '12363d5e-f500-4415-b2f5-231b982017f4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '13863117-c6b5-4228-b0aa-ff884cfeb687' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '13d9d575-dae8-4b92-9e3b-61f717832b54' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '14e3f899-ac0b-4185-ab17-0a9d9ef6ddf0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '18f3e2c7-69c8-4872-9042-24b28ca4906f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1fba9192-b5d7-44da-94ce-8151d7523946' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '22604e7c-002c-4d9a-9569-c2cb2b44965d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '22847e9c-2201-4d9e-b4e3-ceaffcbbae8c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '22e5debd-4a00-4ecd-8f81-24f9137b44e4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2326d16c-7949-4de1-873b-45f2ce89ac58' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2566ec64-ff47-4dba-bc95-ce4ed9c93cbc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2798d46c-62f9-4a6d-bbf2-1c16f50d30a3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '298b139f-940a-465d-b0b6-e42abc3342ee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2bf28c58-a33b-4d4a-9240-c69f6aaad3c7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2d4c111b-ad82-4ee7-8eb4-ce3b32a2dba8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2fb279ba-a41d-4df1-a6dc-89de1af04679' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '30eee03b-32c6-4f0c-b113-83751182d150' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '31c8b3e2-cef2-4a74-b4e2-5f13d9dbb005' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '37b37868-13be-46c7-be98-02ebf79f7072' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '39e66b23-9a11-4a47-ba25-8c58cdc0dfd1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3be21af6-343d-47f1-8db6-da6a9f064ad6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '445782d8-e9cf-4c5b-a908-fa5a67cda91b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '44c9f85a-4616-43ca-baec-c2af5201d5ae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '472d8aba-420e-42e5-b36b-2053b70b544b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4bbcc0df-f555-426c-9cee-b41b63b128de' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4c552701-899d-4ec2-bb5b-db474b06931e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4da6530b-939c-40c1-9b2d-bd7fa54ec16e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4eafaf65-6660-4a3c-a840-126ce27ef009' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '51bf68be-352b-4585-bed6-dec72a86132c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '53a3e435-ce9e-459d-a873-1380b2c6096b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54e7e720-0a4b-4181-ad7e-5d3647b5daab' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '56d9fa22-e582-43b0-b77b-ae7dd98ed071' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '65879b38-7984-4468-a903-8e5fd94439ff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '69254037-a078-4bd8-a926-e6133e0eaf64' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6a6b0da8-7b95-4194-b422-9a8841650228' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6a9fafa2-814f-4c18-975c-57c61c3335c0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6bd337a4-9a39-407a-b0b2-3ec5e40d33fd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '72c5edf0-8706-4fc6-91d9-ce8a3b2dbcf3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7430f4fe-b178-4a41-9f82-63ad0c22e478' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7dca3fe1-d118-401e-a212-abb4bda11994' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '822a60b0-cd09-48eb-a130-1a1e36b18ed4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '86da341a-6387-4e83-b036-1f9f6bbb1ab9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '901b5ea3-2084-4c25-97d7-f06cc234f450' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '90421bae-c4a3-4590-b6a5-5908bd4c5742' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9042c77d-8e0a-4826-b2da-96f0ca412501' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '940a5a00-dda9-46ca-b655-549296cf7dcd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '96cb11c9-52f3-4f55-88b0-f01d079412a7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9881fb75-87a4-41d6-84d3-5f740cc15fb3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9a22b697-8ffc-4ae9-8160-4eb1e3ad5100' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9ceea8c2-a20a-4738-8aa4-99357adb4436' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9deb357e-ea8c-4dd6-a06d-92d37baf8e00' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9fa0dac0-33ed-4fe5-a6c1-8feed4ee3894' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a900958c-21b2-4cf7-acbd-62deebbb27ea' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a92f0c6f-0b19-484c-9542-f5a8e8803c1e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'aa8219cf-e0d7-428a-8adb-134e10a4941f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ad2ec659-261a-4511-8ea5-5d740388cb48' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b81196e1-dc10-4ffe-838f-1b9cdce5486d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'be841ec6-44c3-48c8-b290-2aa8a2955aa4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cdab7966-822f-4079-abdb-1676a9bc678a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd40b117c-ab8c-48a9-a3de-ff7ff906cda0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'da18ccba-9d8c-429a-806f-a3ec4a96c40a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'de3a8049-5b02-484d-bb42-a454b9961e4e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e45783b4-4a71-42cd-8df5-bf979a533b55' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e53c19f5-09f3-4ef8-be7b-3197b00404b9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e702bceb-8a7b-4579-abe5-00f63c0ba616' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e83a8bc7-8de8-46b4-a093-39b26af2b3fc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f53a9dd2-6f71-4901-bdd4-3e2aa0093af3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fb23488a-a8b1-4928-84b0-f0cd0785fb86' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fd44d09e-a136-4973-ab56-386307400ff3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fe308f3c-bdcc-43c9-b846-0176c220e105' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '024edd2a-1492-4254-8cbd-49e513ad12d9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '09ae4333-cc0a-4363-b5ab-766031e8f6c2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '184784a8-c8a7-40ec-b367-3f0e28afae9a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '239e1d29-8f92-41f7-93f4-d5598c9698cd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2a9ec07f-4da4-4a4b-8db3-a4cae0b20a00' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2f4f7895-8a17-457f-8252-c1f7763cf62a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '30bae963-61bf-4f24-8557-608c9439e53c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '371695c0-5e59-4adc-91f3-9408c9316ec0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '41273925-7ff6-4a47-90af-175c19c90959' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '42ed6e9f-c52e-4a97-aab3-8e7cac424213' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4dbdbdb4-abfb-4c47-9a94-6afe04d89e25' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '512e45d6-8b8d-4e0f-88fd-e22b637cf73c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6030142d-1692-4ebf-b813-20004729edcd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '65ff9e5a-2d2f-4e16-955a-8e5e803573b7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6690d3ae-f5c2-481a-b8b7-2cf7296f79fa' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6fb4152b-0b36-4966-a7ce-b3342aa642d8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '73ab3f7c-f6e9-4811-99a4-fd1d9c7df3a3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '798f9854-add1-4962-8c9b-c9f8a1ef4752' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7b2b748b-8490-4904-b30c-1c7a0cd76fc0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7f282770-0f54-471d-9d7f-8aa1f7616d80' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8bf7c4a2-d129-4922-bf97-94e40d7ad01b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8c0d3512-3a12-4531-a93e-690ede005423' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8e425174-2fea-4047-8a0f-2cbcd730fcb2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8e773991-f4d4-433d-a0bf-ee50a9dc42e6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '90d520c1-79ad-4dd6-b9fc-7cf4e427ae2d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '92159fac-e333-4298-8705-3efe8fb7b519' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9372d1d9-b53d-4821-ad76-097ff76a3e95' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '93be67b4-86fc-4ad8-9af2-20eee29767c7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '96b5a4ec-5997-4567-afdf-66ea97ae6c12' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a0707de7-f91c-411a-8ee5-8bb4163927c8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a3e8118e-39ee-4c1b-b486-c29154590047' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a544ce26-f0b2-40f0-8620-e9396934fc36' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a9decd55-3bc5-42e2-af85-77a4d572c78a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'acf81fe5-6962-4a8a-bee7-267cb57da52f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ae9eac7b-b0c1-4b9a-938b-52d92666d2c8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'af9c9d74-3300-4e1e-aab9-8ff3ee542f0b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b0cbc483-228b-48d5-98af-184a12a41e6d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bbae2841-0d95-4b87-8020-85c2d7ce6a81' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c2d15b54-1f06-4fff-a3bf-789690e4e2df' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c6a79c1d-2320-4748-846a-526364823c89' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cbb1bb3c-b908-451e-8da7-b05081f870bc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ccc0dbea-6e16-4266-8f0a-5336a8834e09' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cfad020b-5fa2-4646-9553-7bc6ac415de1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd59676d8-dc9e-4b45-bb6f-7c3c82048252' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'db41e1e2-7bc2-4316-9401-4a25cc1e5a80' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e0f4f22d-2566-4cb4-9ad6-b8b0860bc0dd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e3cc2f26-93e8-4313-b8c3-f28b8b43de48' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ec127c74-490c-4c56-b5ad-0e89dbf0749c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'efaf0a6d-bec4-48a6-8620-d2160130d972' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f272a39d-a42e-4d95-bff5-d1b3d3c48163' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f2dd7033-45d4-4c3b-886f-124dafebc327' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f5c48f10-6b39-40f4-80e4-6ffb20a96206' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f9163a89-bbdb-4037-be87-44b7666f22b2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1b146c4b-0025-4d1e-b517-a2ba3488839f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1df4a481-9fff-429a-920b-30b61636fb91' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2a52e28b-e6d3-47d7-8411-ccbe1700f605' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '39858828-8f08-4f6c-83da-f219525f98e0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '470631da-14e2-4876-ba71-9a1a73c398c7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '49fd3888-81ad-49ae-b2c4-ca37218b2eb3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '67517db1-5915-4400-a93b-9e67890540ac' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7b862b0f-227f-44b4-aa82-663dd47b6bcd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '87e4832c-b5f8-4402-a67d-50dd409c183c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c6ca2ca6-622c-49fd-b053-29840a2d8b29' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f91a0528-ad69-450f-948f-1b457940c3d7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '03a394c7-97cb-411b-b335-dcce44d6301c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '25ac4f9d-3d36-4a04-b9d1-e2432fd7bd14' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b8bb695-2147-4320-bd7d-90e2e6ab2747' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '30a16f62-8fac-4296-a72a-366475c72620' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '341ab7c0-6a2d-4ff4-b713-2e2957b061a4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '478d2642-2ea2-4d6b-9df0-da1606a653fe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4d753e9b-3758-4322-8110-01f2b61182be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '521ad0b1-ac68-42a9-99a9-1993c5fd46c9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5c4ffb6f-6290-4911-9fb8-9f174ebe70df' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5dac2603-8748-43e4-ba06-3e1cc2098095' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6f7ef6bf-8ba9-4ad3-bf7d-64a48457122c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8dfb1f28-8f39-4bf5-bf79-3054fc2b303a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b3b46561-e3e2-4a4d-a5e2-f6eef1e74fad' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b4ae1896-a0f1-44dd-8582-8283e801a787' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd5760121-22fe-4616-aa1a-d9bc1d5fe123' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dcde0e95-28f6-47d5-bd74-6e334440e477' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f0d09824-8a7b-46fa-8760-537544a55813' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f70b39c7-8e22-49f0-82f0-7750f7a50f3b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '026f77fd-733e-480e-97b3-e9db3953871b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '030632f9-246e-4897-92bf-c5e6110ba262' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0aa805b2-bca3-4948-b7c8-e2e752cf5c2b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0aa82853-8a62-415d-8485-a30fd081aaa1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ac3a7b8-2011-4dad-bb5b-381d3bc41cb4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0b95a68f-507a-4ee1-bd04-78055d70a9f1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0c6a17d3-9512-4fe5-adb8-b0b61d46841b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0e292696-edbf-48e9-acb4-4004cbf2f20b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ee472b0-06fb-4c89-a0aa-6c2b6c1f1aa3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0fb047f7-7a0a-43a1-a00a-4be029f2b664' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '10109599-70f0-42ce-a820-310a208d532a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1802c102-af5c-4eef-abaf-a6c778a59d70' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19952b7e-1ea6-4ff2-bad2-18a82458ce18' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19f732dc-9309-4977-9a4f-22e503e3b653' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1e1e2626-913d-4b0d-a9e6-5f935686175b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1fe3f9b6-3c3c-4e9d-a966-fdd1b17c9dae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2787068e-94b1-45f6-aa9c-bb8f22ef18ae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2866bee5-bb24-459e-b763-b76dc147c21a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2c788344-bb82-4242-81db-b6481a5b06ee' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3aa032c3-b8eb-4add-a2d0-6711b8e740ab' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3d0de52b-56e3-4f5c-9ef5-c1deed5123ef' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3dc08cd5-fcd3-4162-8d9b-7da50229fa24' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3dcb4df2-9a90-4c4c-a6a5-989d03d14663' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '429fc321-e7df-4eec-8793-83a6f58ca20d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4822e7d5-f9ef-429e-9259-2128ad26855a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4909d6cb-7a9e-4fa3-8077-6f536fe3d5dd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4930cca9-f59e-473d-9191-20ae672fefd7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4a1cd50f-db87-4218-bb6a-e220fbd18ca8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4acb5544-f655-44f3-9e79-2bc9cac9afcc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '595bc501-0e73-4a63-80a1-73f492203aca' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5c0fa3da-af79-48e6-bef5-e2b2712c5e47' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5c57908c-143f-4507-b68b-edbc44a6f768' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5cd0b4d4-f2d9-4206-accc-b63302aa6db1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5d734a0e-bd81-4582-a930-c4c3d3f4b5ad' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5dc7a104-0dcb-4431-9986-3e01f31e29b5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5e03301d-e11f-49c6-adaf-647196ead883' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5ff1ad10-d371-499d-89fa-190743a5d0b9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '60572031-b600-4eb6-a4c2-bd852ecb6f12' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '60e73c0a-9d41-483d-a15b-94971f082c36' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '62d16f69-28be-4c07-b1ec-2c02525dcf71' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '664daa2c-9b40-4376-aa57-0fb962cd26bc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '715bd000-170c-434a-8518-f2668c2f7bcf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '74c37577-e561-4fcc-a883-db50dfc811d6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '79f4975c-beb7-4254-9f79-a04614ecf9b3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7f7429d0-18cf-4c94-a667-f19a04ebb435' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '80fe59d1-cae1-4f54-8afc-7e9bd9b902a2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '852fa66d-173e-4e21-abb5-ff26838f604e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '87442a41-57c7-4709-ae40-c1ac2f9eb9fd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '88cf6270-4987-4d4f-ade9-29bde07e5623' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8bf386ec-699d-45c5-b858-4bbb2bd8777f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8d16d719-d626-46c8-ab1d-6e5c90f1ea50' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8e0f988a-d660-4a5d-bbee-5f5b2c720d17' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '953d401a-8f78-40c5-bf0c-18e08feb1e35' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9ae8e7da-173f-4792-9cea-74c0050a0e3c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9ec27473-f5f0-4983-b382-3aa11fbb25ac' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a2b4fd18-efb3-495c-bab6-ce046943ef5e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a3838c83-fe32-4322-a0d0-c35835b3f9fe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a6ba40e1-30d5-4c6a-b3bd-452d7e930b6b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a898391a-af8a-4279-838e-2be213682d52' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a8e7f240-4fff-429f-8056-6b8c8a34e989' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a94a0640-9e92-48fa-9315-7e8ad03e0509' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b0f8679b-1c53-49df-a550-e44fa967b59e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b52b1f20-f6a4-40ca-abc5-6477f292b92a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b711f7ba-c3b3-45eb-903c-105ba8cfb8d1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c00b696d-dd40-464d-ba00-280f1e3ba631' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c37b6520-6559-4a17-bb91-1fef112c39b9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c7176b9e-fb94-4259-bf24-d2d044f57baf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c9604e48-81a3-4346-b941-be5add1e1acf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ca6ad19a-0171-47ec-b72e-13c76f0bd59a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cea02755-ce48-4867-b960-7922b9035bfe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd0bd0def-8638-4b72-9d39-444a175cef3b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd28473d6-5b22-4459-a4ac-a61a28143df4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd7186574-1dbe-416c-8e8f-535afbc14679' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dfa2e462-f5ff-487f-9042-ec4a60b587df' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dff146c0-3561-4bf9-b48c-edb76085d77f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e0d6380c-56ec-48cc-8343-5df76a81b1be' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e3d7036d-d401-41ff-8187-b38eab0b3976' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ec29d906-76c4-4303-9973-32619035c087' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ed47393f-6ae0-47f4-abe4-a610c19e561f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f17ecf9b-8b24-4901-8be0-f342d37e7034' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fd389d13-7879-4fc7-adbe-85f3aa04fee1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ffec638d-58b2-4a2f-9741-53388be38ba3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '65e43906-9075-4a6b-8f88-409ea8c13c47' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '086f030e-c2f7-46ba-887a-42c22f597047' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '187ef649-027f-4bc5-8b92-c4f385d4148e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7f8a0388-0531-4bb6-bb5b-76c24d0a93f7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '83d8a55f-cb2b-4562-9118-f22571b3a7cd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8a5bc716-157f-4d92-89a1-cfc224574b6d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '95b8eb0d-395b-4da1-bed0-bb2f9268ab3d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a1364299-4133-4a39-9fbe-6830f0e94028' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'aa328611-160b-469c-a0f7-272aeb8270e9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd7f2a62c-6d17-4402-a221-1963f4049249' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8cd079a9-c185-4349-8bd4-7537d7798d56' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '45fbd742-4488-4a47-b64a-66e489f66ba6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0d303f99-4efa-4492-b4bd-e2329e6e1121' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '15a2885b-9b54-4f87-a2ae-b54c473a11dd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19231440-5936-4c10-b6b9-191906d5919d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '236de728-eb1b-4cdc-8c12-b0d0a6d1c649' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '254bee87-cc15-4438-8880-f17695fcdf8f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2555f0a9-e0a1-4987-ae72-6cba7fafa388' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '273706aa-d03b-47e9-84fb-0fcd67c25eae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2744bc50-7776-41ef-97dd-86621c47f9c4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '28f2b188-7ce2-4375-ba58-6c1b1d867d9c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2aa59725-e0f5-4b41-8aee-80a745ffd18d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '394ba355-fa0c-4134-92ad-6212a335927a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3bb177a2-2926-4eff-aa04-a361b1faf2a8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '45025e14-0d78-4001-84be-805fa58d9fbb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4a28f086-a75a-43f7-a4cb-f04159587519' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4f87d08a-5527-4f6e-a3b2-47896d38c2f1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '52fda739-2b7c-4da2-9c8f-946a7821cdb4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5752b652-c262-4569-b112-5e7de601d8f3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5a6a95fe-0e99-4189-baf5-b152e427d0c5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5e38ca41-a5da-4853-8057-459aef1099cd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5f2b6680-8fa9-4f25-86a7-122159bbd51c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '63f85f49-9004-412f-bbcc-8ba402fcb2ff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7600536c-790d-48f5-a00a-35516f7c1557' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '76032ac7-c689-464e-bba8-76cebd03bff4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '78aa7a34-69bb-4cc6-98b9-055a67ba39a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7c1925d5-ed00-4b6c-972f-e6c8edc0ab6d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7caf3b3b-df0d-457b-91f7-7e1942719d76' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7d36b6c2-6bfe-457c-acf5-5d23f92d2a9b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '803d6e16-6193-4fa2-9802-d55dafa040c4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '865efead-9dca-4258-891f-c808d0490806' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8e086dac-5c4a-4352-b6fc-665330ab8f51' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '91504c40-96dc-4b75-a56e-c6b7cab0b891' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9c30f1b7-331a-42ee-89ba-cb7a613de1ea' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ae60077f-e879-4604-b854-f1dff641efc8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'be2fc805-fe80-4726-898a-094a7c2da4af' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bf85ff46-b921-4b00-9e73-fac49115733a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c3bb6e34-001b-4cc4-bbe0-640c320c20b2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c4f1e432-4a8e-4760-8906-9677b6032ec4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c9801efe-a148-4c46-a08c-3e23175405c5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd2774e2e-a38e-4a48-9df4-823dbe6cb04b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd361c306-2b96-4ae8-92dd-e1b7489e7f32' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd5e366a2-ff6a-4720-9815-0509ee3e2ff2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dabdb6ef-d996-4e61-ba47-ca7e452fa1cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e5b1ba69-379d-475c-9c38-243fd1d142bd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f0222f8c-8c7c-439e-adff-c1bdafa0ed3e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f272db35-e769-4ab6-9f51-2fadb8b0aa60' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f45d9f38-62ef-4a1f-b5e1-e00c8a416ca8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fa8dbc4b-1faf-42fc-88f4-69d8a85bc043' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ffc4d711-b1a7-4c3b-9893-0885fc16eae8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '04eb9169-5b6d-4f4b-b4e9-a960caa63010' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '132f5dc8-9dbb-488a-b1a7-22bfe0ed4495' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '177724d2-7e22-4527-9029-a43591d52a09' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '21520351-1bc0-4a55-9c61-331dab3baccb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '230f9049-3395-4cae-b675-6737c79c1993' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2a2ae2e2-1237-46e0-b117-9c07b54cf3b3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2a5a0697-eeb4-4401-adfb-0341e2a798c4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2aaf9188-ba24-4304-aca2-dd3de68cd6ba' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '31e6f02d-b7bb-46df-9bf3-e266f066fa57' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '37636a02-792b-4f9f-a0d7-c6c1b2d04bd2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '473ae12a-88f1-42d4-b7ca-6665aa9fa0fd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '52cdebec-4102-4930-bdcc-a0bbd137ffc9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5a05eaa2-aac7-4f72-ae39-b1c0ec74462d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '615a4b55-7107-423b-8238-e6d465a7bd00' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7006855f-3505-41f7-a22a-0fddf9af238b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '71288896-46c1-426f-ab13-61551dcd689d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7882800a-7e6a-443b-9862-536cea1c8215' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '789cf572-81c2-4f8f-b96c-dbe88489dd2f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '79ef3c61-4336-47d5-b2ca-b2c1c32f9c2e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7ba129bd-f420-4e56-8752-3bc9059c2fd5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7ca261c2-2695-4ee9-b992-e399c4bc6dd6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7d2c89b8-b310-4d2c-8056-2916380b8248' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8aaa2299-4c05-4cfb-8e7d-b18ab60805f0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8b87cd7b-cad2-4e45-8bd7-8ba97729f8c7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8c04414f-69db-44b9-acef-b027be5ff090' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8d5d8e0c-86d2-49f5-9306-085f26f6bab3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8f9db191-78af-4c89-a54f-9c5c8bfc69ef' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '95fd7bb5-57ea-44ea-9740-d6047780c0fc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9aacd5f0-0f4a-4b8f-a9e8-7b6ed1b67824' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9e4f848e-8334-47fb-97ae-5cf4d53689db' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9f314c81-1bd6-4786-adb3-6535a04a9d20' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a4b7d72d-595d-4f38-b4c8-869f0c1e7730' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b1804f98-f352-4092-9f42-766b27b9cd72' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b296df77-9bbd-47cd-a2c2-205b8fa6597d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b315f8a2-0f2a-4d31-8402-137f71421489' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b59b0be6-13be-4c83-9e4f-8b0da5c64bd6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b5c32af0-d385-411a-b76e-903d4fb7f647' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b917e7f4-3a13-4a5b-b8bb-90faf706d072' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ba0e1210-8f84-49d0-a304-30c771f5e2a3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bb552ee8-dcfe-4168-a7bb-89956308a782' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c2cedd5f-a6f1-4499-b70b-ed02a25b4ee2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ca2d912d-9798-410f-893a-ca878fef2330' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd3699e25-f039-4332-b174-904f6f9e70d6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd4110751-5bc0-4500-846d-643cef62be3a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd46859f7-8889-4529-a99c-c8503dec4760' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd710eee6-aac6-45b7-a89b-7ba2842e85cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd979fee6-4fa5-4acc-9d8b-185a8f662263' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd98c151f-4b0e-482f-8b35-1493cc87a312' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd9d9344b-b34b-4eef-8765-fba873a8f6e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'de72c5d3-774e-4bb1-a0d9-9c6b8e8c5aab' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e8ed279e-df8b-4521-a584-35e1b1235fad' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ecae6659-45e4-4245-b103-86bb59105fb3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ee88b3ea-b1c7-42fb-b7b7-77b607f57fe2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f6259eda-ebf1-48ba-888c-be61f9996fd8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f6666889-6085-49f3-873f-9116be982f6a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '00a9fffd-930a-4e39-86e6-656675c6b48f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '08992a7f-353d-403e-a09c-38823b338539' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1c1f05a3-9774-4982-bbba-0c573070e1c0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b006070-83b5-4cb6-8aff-1ba6c149c84f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4dcb8618-dabd-4b4e-a409-f469854c2695' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '82be0fd6-b4c3-46eb-8ba9-490a9f865d62' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '94aad1cd-7773-4ae4-89e9-bab8f9eb2c14' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a1f51372-9b10-484a-bf89-ba45ff6343e4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a5b060df-84cd-45f9-88be-afd99221b08f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bb1a9283-f897-4295-a664-9b20edf437bb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd8f3bf50-61c0-4497-a7cd-3c6004b53766' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'de2e7acb-d569-4f16-8841-8020c0ddb101' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fbc34118-9c5d-4a09-a1f6-30dc20393cc7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fe9682ab-ef01-4957-a53a-0338dbb33b95' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6bca3a83-bdec-4419-83e4-382366e08c70' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dc2d97d3-bae2-4850-b17a-2fd267fccd36' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '314694ce-0eae-46d6-b058-69ed66eb8283' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6d8899f3-ace2-498f-b120-d7e69f4dcf1c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '841f051f-f6a9-40f6-84a1-e1a96abb11f6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '03db60c4-b9e4-46e1-a5b0-05f0e5367682' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '05a78acb-27f1-41e0-8ca4-7161d541f70d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0b9aefa4-8c09-4d01-8ae2-baa5e33a158f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1394caa5-4335-458f-8324-87ae77b4572f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '14966f5b-f097-4b73-89ad-7020698f484b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1562cc50-9f57-4c7d-9e8e-bc1e73bf6f4a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1f45d588-5a51-42f5-98b4-a9faa6bc233a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '21565a75-1547-40be-b897-7b3bea8ac9e7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2c83b292-1461-474c-94ee-0f376e2d4dcb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '41339aab-5514-43fb-9947-d1563f787f18' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '43fd2d73-ed41-49a1-bf7c-c2e21e1b129a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4ffb9e2a-7d2f-41fc-9199-ce399500128a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '66aefaac-6274-42fd-b5ce-72ad59264bc0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6a068b53-9df7-4f1e-99ae-523500d843a4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7cdfdf27-59cd-4296-8e08-723f3938d683' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '89aedf34-e859-47ff-8875-bd577b009577' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '942b619e-e5b6-4755-b3e5-8f171fc7b93a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a1e48f0c-da69-4ccb-a126-30ed9c7a99c0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a3c9885c-1b3b-41c7-84c5-b3748075ea79' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a9d3dd35-b690-4a85-b1bc-ec113b2f3974' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b5b377f4-d1fa-4bfc-a9d2-8471f08c8546' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b7912b52-f61b-472f-b919-ccbd5cb2a75d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b923fef9-945e-4901-a9c8-b6bcf444095c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ba6d37d9-4079-4600-85af-9ff5b14b2a35' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bb4cbff8-1008-421c-b30c-ecd50b0f8635' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c6b87ba5-1517-4014-b5b6-217103129f73' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd634648e-a4b2-4d1e-be84-9459322a33f6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dad679eb-29d2-4f13-82a4-5f26ab964b87' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dd610601-de8f-4fae-b606-2220cc7b4650' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'df95ee4e-d30f-474c-abd8-eab688b78085' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e00807f3-51eb-4efb-8ce8-768ec198bafa' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e6d0275e-93b0-4fc5-9cbd-3e10e2fee878' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e917da6d-b1e0-4ee2-9974-c1bd5e096ccb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ec97d75c-ce4a-4c86-98c8-8c6032b52509' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f8c2d31d-1e22-492c-963f-3116e9688c9d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f91e6811-dd5d-4209-bca0-2cb350042e5c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f14e4a27-fb1b-4f41-9f84-53a837b4da87' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0a7aa657-456d-4020-b522-c86c510d87cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '25617956-d99a-4e9c-8149-66c80bfd5fd8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '25e718cd-5949-4e66-88e3-423d8c3ea3b6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2fd8b3f5-d793-480e-a902-6a5580aa4114' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3e44a8ca-00c2-4a84-94f2-c93f58c4bbd1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '649b86aa-d687-48d3-ae01-640a1e26739e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6765fe79-510f-4994-9473-4a891aee3b6e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '67712dfa-f1ec-4499-8c8c-f4c7fc205725' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7435bf2a-9109-42fd-a20c-62e7162472a9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '771e70d8-f481-494c-9b2a-ba9bdbf69c1e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '781f2d0e-fa8f-4090-9cbb-3342b78c12e3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '84963a72-7646-43db-b622-ef9e0e04117b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b65f7d69-0bf5-4587-8c2f-3eb9005b936a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c593a461-b01d-4ade-aeb6-8fbac9788593' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ceff0144-af18-43b8-b298-812abd7031e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd1bbff46-65cd-42c4-a1eb-5629b33bef8c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'df117dd1-5e4c-4b00-a811-a6cc93577bea' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ea78caf0-68b6-4421-8f03-98ac545d83c8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '03f8fb81-fce6-4279-9c43-d2b7215bcf28' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '043683c8-ee0a-438c-8e73-b68546780fc8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '23219a56-dc25-4d69-a3b2-4db740f89dc0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '24afcf36-192b-4663-91b6-483206477eb5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '32425c59-cced-4b14-9609-511e8fbc24f0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '36af505d-1891-4b2e-bb56-74f9d9e770e0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3919c2dc-ccaa-486f-888f-4480b50853a2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '413c331e-a4d1-40f3-83a4-96bfc4f1478d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '495d557d-00d4-40e6-ae4f-2e34f378c170' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4a6c45a2-540f-4edc-963c-fd42718a2d04' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4d6d19a9-cf49-40ce-9770-52d0a358fd98' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54b3889c-0c97-4140-9c3c-cd12a7181849' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '62cca605-7cfc-4ce1-9707-0619d7595e9f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '62da9b01-160d-4f4f-a1cb-4eef9ede97c9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '691da316-7cc7-4181-a53b-7220d9f191e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6c6a6ff3-31fb-4c0c-8ddb-1045b4c1b561' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '862e3952-5f8b-4631-a163-39756899a078' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '909e03f3-b009-4ea6-80b9-4eb99248a6c0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '912e5a37-d9ae-4b9a-ae35-16e3337594d5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '957a6710-71bd-41fe-98c4-73c6036a5826' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a5bde85d-1dc6-4ca1-8bd2-2390c4ea34c1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bec88d45-f69d-4102-9970-e42c22d0f999' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c8765203-16f5-44a5-acd0-ebe0a526613d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ce8c74b1-3715-4d1d-9a02-e2dff0c68143' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd369b38b-d4ff-404a-94f5-d057f2388947' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd6c48448-56f1-4295-9c04-8c4568c07d24' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e1a3ca14-e6ba-435c-9ff7-fe9684e861ec' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e9466155-2eb2-42a5-9efd-d91d0d2f7f07' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '411f9899-8dd1-43a6-9ec9-3855feb5c02d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '519f3708-1d10-4026-a6aa-39f4348b43bd' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '68df8f93-8f45-4be2-9433-56d2c30cc5aa' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f1fc6401-59b2-424e-9587-698b8cddf14b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9f5be730-2024-46d1-ae12-6dabc82ed3f6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '01082533-8424-429c-90a8-0a05f34c7df8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0306754c-c59d-4ac2-a87e-3df9cdcade15' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '047930ba-538a-4861-9205-c8e40b019a6a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0561788c-b4e8-4829-8334-c91aa276569c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '09e2c77f-61a2-4758-90bb-da7f285654ed' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0b8fd058-64bb-41eb-9c31-b887fa90248a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ccc566f-65c0-4780-bc14-be53af5a76a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0d44ead2-3aa2-43c0-ba80-83fb1e27bd33' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0da1ecab-4ac7-4383-b14e-81028dffe34d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '10d56400-4558-410b-bfcb-5826f2460359' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '11397fe7-6395-4e62-81bc-aaebe45b3653' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '125ee43f-ea3d-4196-a272-602338c5a363' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '184bf95b-5d46-46b5-b018-c5257ae1e731' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1940fab7-6b06-4607-91e2-7f7fab12d16b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '19e45a75-0fc3-4ea7-a1bc-f5e7f25cad0d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '20fabdac-814e-4474-9712-31a6200a4360' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '23923db8-bcbc-4ae2-8a29-b1581fdac0d5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '297ce93c-fd5a-4273-99b3-5d8ee57b555c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2abcd180-259c-420d-8f60-714e73a77523' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b2c2090-0d5a-46c5-b0cb-ac358c8ae9cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2b872d6e-82fc-43f1-9ace-58234ffd4143' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2db01f61-7eaf-46dc-aff9-c6c6268c5107' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2eaf71ba-9bb4-40a2-be94-7d01f44d8109' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '33657991-4dfb-414f-aa19-9e7ec9b382ec' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '34090b66-0401-485f-908a-23435eb126f1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3b421aa0-6cb9-42e1-908e-f1f64249a980' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3b9b2113-7f35-4ead-92d0-3bd7e88f0749' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '40de8bf9-7b4c-418e-a313-fa5303e66f38' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '41dae8a1-4251-4edc-b3c5-494e09430a7e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '49969772-ed77-4603-845e-7fe5c898c40e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4af95751-a0b3-4861-8504-72fab72da633' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4ed558df-935f-4fb1-a0f6-89b714f2ac09' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5148667a-d08e-4b34-92b3-e8c7bf664aa9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '51a0542d-bef0-468a-946f-40a8f86d09bb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '521dca0b-b6a6-4b8b-a215-563aacdc61ad' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '52fb072c-e09b-4413-80eb-eb311a3e9fe3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '58012d48-a502-4b8b-8b63-2f615513f0b5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '593cbb67-8111-4dba-abb4-b4023a4beaf1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5b3da69b-2282-41ec-9526-d1a36efaf052' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5cd488a7-6e3d-449d-8a25-ea0fc4248ca2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5d8f7392-1758-4b30-a492-32a73c0303a6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5f4b3217-81dd-4b43-90ea-1069fbbe8a1b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '63345074-e823-486f-b8cd-820d7fa6f757' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '63ac76f5-4ca0-466b-87a3-50bd0c591a47' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '64cbec5c-efc5-4acb-840d-52b67426a9e0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6681a464-9375-4180-ad3b-86c10b3d60ae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '66fb63df-a781-489e-8d90-69c5cb540b70' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '68d43036-5687-4c10-a455-cc7ae231c8fe' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '699ebf6f-f1fa-4654-8d0c-33f74254a190' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6b3c0130-a059-4e61-a67f-226d0ad2c863' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6d73a4d4-fd3e-41e0-8627-875328c81b04' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6dc7d219-cf54-4366-9de3-b492e903393b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7157cc7c-0a23-4c70-ac53-f0cc7686d570' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '73349bc6-26b4-45df-aeb1-6cb1bd83e820' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '74751fe9-ece8-4096-bcd5-c3b0c45a0881' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7a45dfc5-c2b8-4b05-a8c9-2b29a792cecf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '99237618-f82a-4e7e-822c-2f706ed728ba' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b25bfb1a-0893-4d82-b655-e7d352b223e2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c24b7349-3b48-4601-b295-c80e5cf7414b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c48c9a5f-bfe9-455c-9d6b-733be1a2eeff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dd6cd4e3-1769-406b-99de-317864caf27f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e95df9ed-8539-46b2-a9e0-69ebeaa333c4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ebb8ad56-0fc6-4e6e-b736-8845521fa82c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ec8c0c6a-6c83-45a0-aa97-f307dfc4d18e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ecf00d21-9134-4f1b-87ad-a1ce6290ef16' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ee5b04e2-bc15-464b-a62a-2505fa6103b9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f07f3bb0-e6da-48b3-a066-cd7ef0014977' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f0c3cc70-347c-49f6-8d51-da974513f2f6' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f37255a9-75b0-46b4-87ea-9529f682d3d1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f4c20218-019c-4e87-920d-d573d668c5a8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f56fec9b-d73c-41eb-9294-0679c3de2e7a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f9bcdc90-025a-44e7-8b84-b4df459f6e92' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fb5a57b5-a748-4424-8a5a-e964c741bf49' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fc586e52-b71d-4851-a46c-9c692fa5f29f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '05d53b07-b868-434a-a591-00d36e41ad88' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '11fc9ffa-7459-41b1-884f-67d1043a7239' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '24325085-d5a1-4de8-98c4-415677c89e60' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2625b8da-9950-4cc7-be24-e518bf40f302' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2e0ff8b8-1932-478b-b08a-c88df5f1118e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2f209413-3699-4ee7-91df-4bbea96e733d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '38fa2acb-08ae-418e-8db5-793b7d64c410' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3e831570-656f-4189-b1a4-c2252e4e065e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '46562668-cbb1-4cd7-8c2a-cbec9e438a2e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5038d2ad-0f20-42c0-8b29-8c8329678787' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5855da8b-062f-4fb0-ba4d-3ea591652a88' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '58860218-c7fe-4e50-b981-ea4ea8c4f8a4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '712afa8a-ea6c-49a3-b8da-7e26cf3dcdb4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '95930465-5ecf-45dd-8128-54777e709e3f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b1ee114e-6333-4985-b158-c65afea5d6ae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c1b531d7-c80a-4b99-8438-5847ac47bab8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd5d2ff69-1aac-41a0-a3b4-aed749b6f6af' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f7db9534-a4d1-4050-babe-4d5f59a4d633' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fc2282be-f3c6-4cf9-b2a0-b101287c44cb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2bd580fc-6127-45ca-83ba-ce75d9a69913' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3687227b-1e08-4360-888f-0d5bd7f5fdd4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '42e04073-add6-464d-a3b8-76ee33a10a83' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '44f58b5d-8a28-4d50-b7d4-1536ca7e93b7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4e6e839a-7fd4-4058-92c4-f4ff8e5aa240' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '55eedd7a-5e54-4a6c-92ab-f5d35a0aa06f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '70e99ad0-5722-4eca-aac4-20adad83179d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7764b75e-44a5-494e-81cf-5c423490a9bb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '77c11b52-47fc-4da1-a186-95d536f28783' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '86005998-3e57-4309-8dd9-95d4aa63e785' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'aec80ef4-feea-4802-a6cb-8e0140719880' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'daa0df44-15ef-4b7a-bc55-3153bb89476c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f4c46bae-9a30-47ea-a4e2-191919f36084' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '17766255-d066-4414-993a-73520089221d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2fa2ed5c-8ae2-493c-b8c2-625f34656c8c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '54cd4272-dcf0-4d0a-97af-5cbac185c446' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '77749f5c-b706-47ec-b847-c828686c4d7b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7d720b12-1c8c-41a7-8b2a-e939490f009b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a412a4fe-9413-4376-a15b-4ea7e63f8993' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a5c4e3b0-e699-4fb1-adf7-0af794ca3d07' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'abba42bb-f51e-4baa-840d-d5a557c6e967' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b48c38cd-874d-4684-ae01-6bbc3ca56c7c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bb33f358-4f98-423e-ad4b-0800a9cdf97b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c00f158e-ec61-4569-ab8a-31bfc843abce' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c628608f-993c-4693-ad0a-be1c8a63dbd4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd2e85624-e289-4155-8cd9-21e010462f13' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd3e3918a-8fed-446a-a546-f80102df0835' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dda7555f-79a1-48cb-a4b5-8a081a7875ef' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ea6375d2-af8b-405d-a754-63b8e9c49a66' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ead15c8d-509b-4ec8-b04f-cad4fd9e1d6d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'ee773833-9884-4efd-8806-f88cf65d655b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'effddb69-0c42-4807-8e2e-c9c725ec9968' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f14fa0a4-de9c-4191-b1ee-43b67142ae39' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f9cd319f-47de-4956-87e8-51380eb36ac5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fbaf1f4b-c3ea-43dd-b53b-d68c2f90e88b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '01937eb5-3941-4845-85a9-71f2adaad152' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5c58fdde-0dcb-4f49-b056-e32c0fbbbfa9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '704df790-fe87-4a37-be8b-1a32d32d03ff' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8e64c5e5-fbbd-40a8-b132-9134a654e659' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a5c36fc7-76c2-444e-975c-7936986346e7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'aaaf0ab6-7633-4270-87c4-ab33f3641ee2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '76cb69cc-8f52-4826-8625-e60847d9b802' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '033b0cd8-46a9-469c-af4d-35dfa32c0c08' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0de9c9d8-d591-40b3-86d8-a9b2de0841a1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '25085811-160d-42c1-ae32-5e19286839df' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '52824544-cb46-4813-a5f1-af3f02a33898' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '56850aa2-8288-4dfb-abbe-063cbd6a6f52' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a47a5658-e5d2-4091-8555-5e60718b0aa3' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b71bf9ee-5d02-40cb-b0fd-e998345aa6c2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'da06c1d0-8c3d-46a0-a4fe-f376374f48f0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f25fa10c-f37c-431d-8a56-54b3ac8a6827' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e9b88442-7de1-48d6-a050-c6bed27f476a' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f2b7b005-e790-423f-b220-dc31ddfbdb85' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '11a39e19-355f-4f58-a695-ddc7183e3d68' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1676a71a-4653-4320-95fd-3f84c12b9d04' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2204a9f9-fd43-4f55-8883-d6fb9502a5e9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c0f424f2-44b3-4a0f-95db-40c873ba25ed' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e43bac3f-1737-4112-933d-22ba6b1a2c3f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'be7f03a3-e056-4e70-8abd-1ca61d4bb393' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0415a226-2375-449f-b13a-dedfc68962b8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1978b55c-e566-4dc9-bac9-efc1c445a880' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1a00c737-5791-45c9-9e54-d9e4fb48edb9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1af04f31-092a-4e7f-95ab-1d3455c1d299' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '43c1adb7-1512-4f9a-98b4-df0fbe70a132' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '47d197e9-9005-4bc9-975b-047b98ab1bf8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4aa228de-afd0-438d-a605-52cbef45c2eb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '694626ef-d83a-4cc5-a2c0-300d13105fae' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '69c6b6f1-b637-4edb-83b1-b4f40e23b618' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '88835ba6-b141-4648-8a4a-fc33bc684ea1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '13967977-11e4-4145-bdfa-2012cac6e5bc' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '1408a3e4-4c94-4154-b4c2-4779eef2804b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '49d15579-d70d-409d-98a1-e92606119ea7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '7dcb3060-f88f-4de1-a028-b70a423febdb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0548c3f0-24a9-457e-9919-d17555155bcb' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '09188ccc-e8ca-4c9c-9ff2-2536b439d1e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ada9174-064d-4d05-a9cf-33c2d31baf18' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2f9110a7-a6ac-4c1d-bc7e-7473669e3d83' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '31628680-95e4-440a-a862-83188314435d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '32a43c22-006b-4b9c-a58b-053438d5c38f' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '46fa92ca-4f5a-4834-8394-733b2c5b1c1c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5ef808a8-20ac-4b51-87a7-4872c3c5a627' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6dead94b-2cd8-4a39-a3e9-03154c640e34' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6df4bb47-3e93-497a-9f74-b822d3f1df43' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '778207a2-64fe-48ba-8e2f-dea8550a86c7' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '86efb70a-10b0-4d9a-b364-25b0daa242d8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9071a223-f8f4-44ae-b338-53c8800bf58d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '94c0cfbc-3669-4bc2-81ed-e9d5d0e425ba' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '9fada586-6667-4427-9931-e277af1d132b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a0aead26-8705-408e-b990-7a0ae4873b6e' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'b3429c01-7f8e-4cee-b483-4576e11dece9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bf542d1c-3cee-4847-8abf-3c3db1c4e167' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c71e263c-970c-4c4e-800f-9b7f52bdc91d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cd60a159-2c4c-4f95-9dc1-ac074a8e20f2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f1031a96-911a-4209-be9c-755d13416f86' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f89d19e7-ad6d-40ae-a516-deabc1ec85af' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3fafe544-df4c-42e7-a314-c0fec50604ba' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '207b6fcf-117a-4998-b666-203ff44d3fda' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2be9740f-ba61-45e1-a300-f6bf6cefeea8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4ab101f3-f135-4b5a-bef8-35d3ba145e34' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '53b3faec-c35d-4a24-aa0d-9a447637aab1' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '91e8264e-2b87-495d-9504-0c66f8ffe57c' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '28b4d2ef-d3b2-49d2-944f-ef1e8487f850' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2bc6f68a-9a40-4950-9475-928046bb6a61' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '96253cee-9da0-4817-8d37-fe9132f55e8d' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '988c0cc7-028f-40a3-a0cc-afb1136245d8' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c3a998e8-e9e7-4b65-bcb4-f38bbb3c37e5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '47e2df64-70a5-4d04-8dc0-3c7e968e5186' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '2dbff845-2ca0-477b-94b6-b9c533c41fd9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '43d87b02-baea-475c-8d30-1b9ecc216ff2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4494ea16-908c-4961-9bff-3cbf355b99cf' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '4cdd08f0-08c8-490e-a260-25ac85648795' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5540d0d4-6be3-4567-8adf-512593d5afe9' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8586346a-a4b8-4cde-84e9-48f68c414297' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'a9a47892-52f3-4b20-bda6-904807b060b5' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'c870d3d2-8e83-4cca-9e90-7d32b70a9c46' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cb8465e8-b61c-4b40-a1db-353f0bb401f0' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'cbc09a16-a4b3-486a-a913-6f7bc0989382' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd213ea60-02b7-4052-9174-06321708d788' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'd7220b69-e71f-4e0c-a0eb-ec3985454ed2' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'dc97253e-1b04-49f5-8a84-662566fb0f12' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'f1669a7d-faeb-4bb2-b03e-5bf020a8b4f4' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'fecf8513-5890-466a-8fba-461fe8c8635b' AND is_active;
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'bad0c58d-98b0-4d44-87fe-2cdd878d20af' AND is_active;
INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible)
SELECT v.location_key, v.spot_text, v.spot_kind, v.quality_tier, true, v.pure_scene_eligible, v.character_eligible
FROM (VALUES
  ('1950s americana', 'Motor court horseshoe of cabins curving around kidney-shaped pool', 'wide', 'S', true, false),
  ('1950s americana', 'Drive-in theater entrance lane beneath towering neon marquee sign', 'wide', 'S', true, false),
  ('1950s americana', 'Roadside novelty giant arrow sign anchoring Googie coffee shop complex', 'wide', 'S', true, false),
  ('1950s americana', 'Neon-lit diner with chrome trim and red vinyl stools behind window', 'medium', 'S', true, true),
  ('1950s americana', 'Motel vacancy sign glowing above office door at night entry alcove', 'intimate', 'S', false, true),
  ('1950s americana', 'Drive-in theater speaker rows stretching toward distant projection tower', 'wide', 'A', true, false),
  ('1950s americana', 'Route 66 corridor lined with Burma-Shave boards through flat plain', 'wide', 'A', true, false),
  ('1950s americana', 'Postwar subdivision cul-de-sac ringed by pastel ranch houses and carports', 'wide', 'A', true, false),
  ('1950s americana', 'Googie coffee shop with sharp angled roofline over plate-glass facade', 'medium', 'A', true, true),
  ('1950s americana', 'Drive-in snack bar pavilion with backlit menu board and canopy edge', 'medium', 'A', true, true),
  ('1950s americana', 'Red brick high school entrance with steel-framed windows and flagpole', 'medium', 'A', true, true),
  ('1950s americana', 'Roadside motel exterior corridor with numbered doors and parking slots', 'medium', 'A', true, true),
  ('1950s americana', 'Soda fountain counter with chrome stools and mirrored back bar', 'intimate', 'A', false, true),
  ('alpine chalet', 'Lantern-lit chalet silhouetted against a star-filled alpine sky', 'wide', 'S', true, false),
  ('alpine chalet', 'Moonlit snowfield surrounding the chalet on three sides', 'wide', 'S', true, false),
  ('alpine chalet', 'Notched-log chalet facade against an immense white mountain wall', 'wide', 'S', true, false),
  ('alpine chalet', 'Cellar wine lounge stone archway opening to a snow-bright courtyard', 'wide', 'S', true, false),
  ('alpine chalet', 'Chalet''s timber balcony overhanging a sheer pine-forested drop', 'wide', 'S', true, false),
  ('alpine chalet', 'Snow deck at dusk with a candlelit valley far below', 'wide', 'S', true, false),
  ('alpine chalet', 'Timber-and-stone chalet set against a bluebird-sky ridgeline', 'wide', 'S', true, false),
  ('alpine chalet', 'Iced-over lake basin visible across the balcony balustrade', 'wide', 'S', true, false),
  ('alpine chalet', 'Alpine twilight silhouetting pines and the chalet''s peaked roofline', 'wide', 'S', true, false),
  ('alpine chalet', 'Deep winter valley floor far below the snow deck''s lantern railings', 'wide', 'S', true, false),
  ('alpine chalet', 'Stone fireplace roaring beneath heavy timber ceiling beams', 'medium', 'S', true, true),
  ('alpine chalet', 'Champagne bar glowing in amber firelight beside the salon windows', 'medium', 'S', true, true),
  ('alpine chalet', 'Dormer window framing snowy peaks from the sleeping loft', 'medium', 'S', true, true),
  ('alpine chalet', 'Leather chair beside the cellar hearth beneath a vaulted stone arch', 'medium', 'S', true, true),
  ('alpine chalet', 'Main lodge window seat overlooking powder slopes at dusk', 'medium', 'S', true, true),
  ('alpine chalet', 'Slopes outside first-light run with frosted pines on both sides', 'medium', 'S', true, true),
  ('alpine chalet', 'Sleeping loft dormer window seat wide enough for one person', 'intimate', 'S', false, true),
  ('alpine chalet', 'Snow-blanketed valley spread below the chalet''s front steps', 'wide', 'A', true, false),
  ('alpine chalet', 'Alpine bowl rimmed by peaks above the chalet''s snow deck', 'wide', 'A', true, false),
  ('alpine chalet', 'Winter sunrise flooding a wide snowfield beyond the balustrade', 'wide', 'A', true, false),
  ('alpine chalet', 'Storm-cleared sky above the chalet and its surrounding forest', 'wide', 'A', true, false),
  ('alpine chalet', 'Mountain cirque curving behind the chalet''s pitched snow-shedding roof', 'wide', 'A', true, false),
  ('alpine chalet', 'Powder run descending from the chalet''s back slope into the valley', 'wide', 'A', true, false),
  ('alpine chalet', 'Long ridge of frosted summits above the snow deck''s hot tub', 'wide', 'A', true, false),
  ('alpine chalet', 'High-altitude meadow under deep snow before the chalet door', 'wide', 'A', true, false),
  ('alpine chalet', 'Frozen stream valley below the chalet''s uphill stone foundation', 'wide', 'A', true, false),
  ('alpine chalet', 'Deep forest corridor of snow-bent pines leading to the slopes', 'wide', 'A', true, false),
  ('alpine chalet', 'Fur-draped sofa angled toward the main lodge hearth', 'medium', 'A', true, true),
  ('alpine chalet', 'Outdoor hot tub steaming against powder-white balcony rails', 'medium', 'A', true, true),
  ('alpine chalet', 'Quilted feather bed beneath the loft''s pitched timber ceiling', 'medium', 'A', true, true),
  ('alpine chalet', 'Candlelit wine bottles lining the cellar lounge''s stone walls', 'medium', 'A', true, true),
  ('alpine chalet', 'Heavy timber staircase with rope handrail in the main lodge', 'medium', 'A', true, true),
  ('alpine chalet', 'Cellar wine lounge entrance archway in rough-cut stone', 'medium', 'A', true, true),
  ('alpine chalet', 'Lodge salon corner with a fur throw and two crystal glasses', 'medium', 'A', true, true),
  ('alpine chalet', 'Cellar lounge vaulted ceiling with candlelight flickering on stone', 'medium', 'A', true, true),
  ('alpine chalet', 'Slopes-outside powder run with the chalet''s stone base behind', 'medium', 'A', true, true),
  ('alpine chalet', 'Chalet exterior showing notched logs and overhanging snow-loaded eave', 'medium', 'A', true, true),
  ('alpine chalet', 'Champagne bar shelves behind a polished timber counter in the lodge', 'medium', 'A', true, true),
  ('alpine chalet', 'Lodge window recess with frosted glass and a candle on the sill', 'intimate', 'A', false, true),
  ('alpine chalet', 'Snow deck railing corner overlooking a pine-filled mountain cleft', 'medium', 'S', true, true),
  ('alpine chalet', 'Slopes entry porch with ski-rack hooks set into the stone foundation wall', 'medium', 'A', true, true),
  ('alpine chalet', 'Sleeping loft pitched ceiling following the roof slope to a low eave wall', 'intimate', 'A', false, true),
  ('alpine chalet', 'Main lodge fur-draped window bench overlooking the snow-blanketed entry slope', 'medium', 'S', true, true),
  ('alpine chalet', 'Stone foundation porch step leading up to the double entry doors', 'medium', 'A', true, true),
  ('alpine chalet', 'Snow deck platform with a steaming hot tub and lantern-lit balustrade beyond', 'medium', 'A', true, true),
  ('alpine chalet', 'Lodge salon corner where a notched log wall meets the stone chimney flank', 'intimate', 'A', false, true),
  ('alpine chalet', 'Slopes-outside snow-laden pine clearing before the chalet''s rear log wall', 'medium', 'S', true, true),
  ('alpine chalet', 'Sleeping loft quilted bed corner tucked beneath the dormer window recess', 'intimate', 'S', false, true),
  ('ancient wonders of asia', 'Bagan Ananda Temple rising above the misty plain', 'wide', 'S', true, false),
  ('ancient wonders of asia', 'Great Wall watchtowers snaking along Simatai mountain ridge', 'wide', 'S', true, false),
  ('ancient wonders of asia', 'Prambanan temple compound spires across the volcanic plain', 'wide', 'S', true, false),
  ('ancient wonders of europe', 'Herculaneum excavated Roman street with intact upper-storey facades', 'medium', 'S', true, true),
  ('ancient wonders of europe', 'Epidaurus sanctuary of Asklepios stone abaton colonnaded hall', 'medium', 'S', true, true),
  ('ancient wonders of the americas', 'Nazca Lines condor geoglyph stretching across pale desert plateau', 'wide', 'S', true, false),
  ('ancient wonders of the americas', 'Teotihuacan Ciudadela sunken courtyard with Temple of Quetzalcoatl at far end', 'wide', 'S', true, false),
  ('ancient wonders of the americas', 'Tikal Lost World pyramid complex amid dense Guatemala rainforest canopy', 'wide', 'S', true, false),
  ('ancient wonders of the americas', 'Uxmal Nunnery Quadrangle inner courtyard ringed by carved stone facades', 'medium', 'S', true, true),
  ('ancient wonders of the americas', 'Monte Albán Building J arrowhead observatory on windswept hilltop plaza', 'medium', 'S', true, true),
  ('ancient wonders of the americas', 'Teotihuacan Temple of Quetzalcoatl feathered serpent heads jutting from stepped facade', 'medium', 'S', true, true),
  ('ancient wonders of the americas', 'Palenque Temple of the Cross inner sanctuary with carved stone panel', 'medium', 'S', true, true),
  ('ancient wonders of the americas', 'Ollantaytambo Pinkuylluna granary storehouses on steep rocky hillside', 'medium', 'S', true, true),
  ('ancient wonders of the americas', 'Tulum Temple of the Frescoes interior painted murals on Yucatán coast', 'medium', 'S', true, true),
  ('ancient wonders of the americas', 'Machu Picchu Royal Tomb rock-cut chamber beneath the Sun Temple', 'intimate', 'S', false, true),
  ('ancient wonders of the middle east and africa', 'Karnak Sacred Lake reflecting temple pylons and obelisks', 'wide', 'S', true, false),
  ('ancient wonders of the middle east and africa', 'Baalbek Temple of Bacchus ornate doorway and carved interior ceiling', 'medium', 'S', true, true),
  ('big sur cliffs', 'Bixby Bridge south approach highway curve above open canyon mouth', 'wide', 'S', true, false),
  ('big sur cliffs', 'Ragged Point Inn overlook bluff with coastline stretching north toward distant headlands', 'wide', 'S', true, false),
  ('cancun', 'Punta Cancún open-ocean beach club row with thatched palapas', 'wide', 'S', true, false),
  ('cancun', 'Isla Mujeres Playa Norte bay with Cancún skyline across the water', 'wide', 'S', true, false),
  ('cancun', 'Playa Delfines flagpole esplanade with Caribbean horizon beyond', 'wide', 'S', true, false),
  ('cancun', 'Palapa-roofed beach bar at Punta Cancún with white sand floor', 'medium', 'S', true, true),
  ('cancun', 'Mercado 28 stall arcade with painted concrete archways', 'medium', 'S', true, true),
  ('cancun', 'El Rey Ruins iguana-warmed limestone staircase', 'medium', 'S', true, true),
  ('cancun', 'Punta Cancún beach club timber deck above turquoise shallows', 'medium', 'S', true, true),
  ('cancun', 'Tulum rampart walkway at the top of the coastal cliff', 'medium', 'S', true, true),
  ('cancun', 'Tulum El Castillo stone staircase rising toward the summit', 'medium', 'S', true, true),
  ('cancun', 'Nichupté Lagoon sunset jetty with silhouetted palms', 'medium', 'S', true, true),
  ('cancun', 'Playa Tortugas open-sided beach club bar counter under palapa', 'medium', 'S', true, true),
  ('cancun', 'Hotel Zone resort pool deck with turquoise sea beyond the rail', 'medium', 'S', true, true),
  ('cancun', 'Tulum Temple of the Frescoes step base with carved masks', 'medium', 'S', true, true),
  ('cancun', 'Mercado 28 outdoor food stalls with hanging lanterns', 'medium', 'S', true, true),
  ('cancun', 'El Rey Ruins flat ceremonial plaza with carved altar stone', 'medium', 'S', true, true),
  ('cancun', 'Tulum coastal trail along the clifftop beside the sea wall', 'medium', 'S', true, true),
  ('cancun', 'Hotel Zone beachfront palapa lounge with jade water behind', 'medium', 'S', true, true),
  ('cancun', 'Isla Mujeres ferry dock with turquoise bay and Cancún towers beyond', 'medium', 'S', true, true),
  ('cancun', 'Nichupté Lagoon mangrove tunnel of arching roots', 'intimate', 'S', false, true),
  ('cancun', 'Isla Mujeres Playa Norte shallow tidal pool between sandbars', 'intimate', 'S', false, true),
  ('cancun', 'Nichupté Lagoon mirror-flat water at golden hour', 'wide', 'A', true, false),
  ('cancun', 'Boulevard Kukulcán beachfront strip with hotel towers lining the coast', 'wide', 'A', true, false),
  ('cancun', 'El Rey Ruins stone platforms spread across low coastal scrub', 'wide', 'A', true, false),
  ('cancun', 'Parque de las Palapas open plaza in Downtown Cancún', 'wide', 'A', true, false),
  ('cancun', 'Nichupté Lagoon mangrove inlet channel at low tide', 'wide', 'A', true, false),
  ('cancun', 'Punta Cancún northernmost tip with open Caribbean horizon', 'wide', 'A', true, false),
  ('cancun', 'Downtown Cancún street market boulevard with colorful stall canopies', 'wide', 'A', true, false),
  ('cancun', 'El Rey Ruins carved stone doorway framing the Caribbean', 'medium', 'A', true, true),
  ('cancun', 'Nichupté Lagoon wooden dock extending into calm water', 'medium', 'A', true, true),
  ('cancun', 'Tulum Temple of the Frescoes shaded inner doorway', 'medium', 'A', true, true),
  ('cancun', 'Playa Tortugas palapa-shaded lounge platform above the sand', 'medium', 'A', true, true),
  ('cancun', 'Isla Mujeres Playa Norte shallow water sandbar edge', 'medium', 'A', true, true),
  ('cancun', 'Mercado 28 covered central courtyard with tile fountain', 'medium', 'A', true, true),
  ('cancun', 'Downtown Cancún Parque de las Palapas palm-lined walkway', 'medium', 'A', true, true),
  ('cancun', 'El Rey Ruins low stone chamber interior with rough-cut walls', 'intimate', 'A', false, true),
  ('cancun', 'Parque de las Palapas thatched palapa corner with hammock', 'intimate', 'A', false, true),
  ('cancun', 'Playa Tortugas shoreline palm trunk leaning over turquoise water', 'intimate', 'A', false, true),
  ('cancun', 'El Rey Ruins ceremonial corridor stretching toward Caribbean coastline', 'wide', 'S', true, false),
  ('cancun', 'Nichupté Lagoon broad water expanse with mangrove shoreline and resort towers beyond', 'wide', 'S', true, false),
  ('cancun', 'Boulevard Kukulcán beachfront with curved white towers arcing toward Punta Cancún', 'wide', 'S', true, false),
  ('carmel-by-the-sea', 'Carmel Beach north end at low tide with driftwood and cypress canopy', 'wide', 'S', true, false),
  ('carmel-by-the-sea', 'Carmel River Beach estuary mouth where river meets the Pacific surf', 'wide', 'S', true, false),
  ('carmel-by-the-sea', 'Scenic Road coastal bluff with wave-carved rocks and lone cypress silhouettes', 'wide', 'S', true, false),
  ('carmel-by-the-sea', 'Arched wisteria-draped garden gate on a Carmel Village residential lane', 'medium', 'S', true, true),
  ('carmel-by-the-sea', 'Hand-painted gallery storefront window on a flower-boxed Ocean Avenue side street', 'medium', 'S', true, true),
  ('carmel-by-the-sea', 'Dutch door entry of cedar-shake cottage on a stone-walled Carmel lane', 'medium', 'S', true, true),
  ('cascais portugal', 'Largo Luís de Camões square with wave-pattern calçada and pastel facades', 'wide', 'S', true, false),
  ('cascais portugal', 'Parque Marechal Carmona ornamental lake and Belle Époque villa beyond', 'wide', 'S', true, false),
  ('cascais portugal', 'Colonnaded fish market hall open arcade facing the marina basin', 'wide', 'S', true, false),
  ('cascais portugal', 'Museu dos Condes de Castro Guimarães neo-gothic tower above garden and lake', 'wide', 'S', true, false),
  ('cascais portugal', 'Keeper''s cottage garden at Santa Marta with azulejo panel wall behind', 'medium', 'S', true, true),
  ('cascais portugal', 'Praia da Ribeira ochre sand cove between blue-trimmed fishermen''s cottage row', 'medium', 'S', true, true),
  ('cascais portugal', 'Cidadela fortress Manueline gateway with large-cut ashlar limestone either side', 'medium', 'S', true, true),
  ('cascais portugal', 'Cidadela fortress curtain wall stretching along pale limestone escarpment', 'wide', 'A', true, false),
  ('cascais portugal', 'Open-air café terrace on Cascais waterfront with fishing boats at quay beside', 'medium', 'A', true, true),
  ('cascais portugal', 'Cascais fish market hall interior with arched colonnade and tiled floor', 'medium', 'A', true, true),
  ('cascais portugal', 'Romantic garden path in Parque Marechal Carmona edged with clipped hedges', 'medium', 'A', true, true),
  ('cascais portugal', 'Cascais marina quay with traditional fishing boats tied against stone pier', 'medium', 'A', true, true),
  ('cascais portugal', 'Museu dos Condes de Castro Guimarães Belle Époque villa wrought-iron balcony facade', 'medium', 'S', true, true),
  ('cascais portugal', 'Praia da Ribeira rocky outcrop shelf with blue-trimmed cottage facades behind', 'medium', 'S', true, true),
  ('cascais portugal', 'Clifftop footpath above Boca do Inferno with windswept coastal heath', 'medium', 'A', true, true),
  ('catacombs', 'Sarcophagus Chamber row of carved stone coffins beneath candlelit vault', 'wide', 'S', true, false),
  ('catacombs', 'Crypt Chapel vaulted apse with bedrock altar and memorial plaque walls', 'wide', 'S', true, false),
  ('catacombs', 'Ossuary Gallery long limestone barrel vault with femur-patterned walls both sides', 'wide', 'S', true, false),
  ('catacombs', 'Crossroads Intersection four tunnel arms converging beneath hanging lanterns', 'wide', 'A', true, false),
  ('catacombs', 'Deep Passage narrowing rough-quarried tunnel fading into absolute darkness', 'wide', 'A', true, false),
  ('catacombs', 'Entry Descent first arched tunnel portal framing descending staircase', 'medium', 'A', true, true),
  ('catacombs', 'Ossuary Gallery low arched doorway between two femur-stacked sections', 'medium', 'A', true, true),
  ('catacombs', 'Bedrock altar slab beneath vaulted apse in crypt chapel', 'medium', 'S', true, true),
  ('catacombs', 'Barrel-vaulted limestone corridor with torch sconces both sides', 'medium', 'S', true, true),
  ('catacombs', 'First spiral stair landing with iron bar gate across passage', 'medium', 'S', true, true),
  ('catacombs', 'Iron gate threshold set into carved stone archway', 'medium', 'A', true, true),
  ('catacombs', 'Ossuary niche with skull row above crossed femur bands', 'medium', 'A', true, true),
  ('catacombs', 'Candlelit alcove with draped memorial relief above stone shelf', 'medium', 'A', true, true),
  ('catacombs', 'Memorial plaque row curving along crypt chapel apse wall', 'medium', 'A', true, true),
  ('catacombs', 'Candlelit recess behind iron grille in sarcophagus chamber wall', 'intimate', 'A', false, true),
  ('catacombs', 'Deep Passage exposed geological strata banding rough-cut tunnel walls', 'medium', 'A', true, true),
  ('catacombs', 'Sarcophagus chamber corner where two draped stone reliefs meet', 'intimate', 'A', false, true),
  ('catacombs', 'Ossuary gallery niche recess framed by pilasters of stacked femur ends', 'medium', 'A', true, true),
  ('cattle ranch', 'Buffalo-grass swales rolling to distant cedar breaks under hard blue sky', 'wide', 'S', true, false),
  ('cattle ranch', 'Cedar-dotted limestone ridge above a vast creek-bottom pasture', 'wide', 'S', true, false),
  ('cattle ranch', 'Ranch headquarters buildings small beneath an enormous thunderhead sky', 'wide', 'S', true, false),
  ('cattle ranch', 'Cattle herd spread across a rolling Oklahoma grassland under cloudbanks', 'wide', 'S', true, false),
  ('cattle ranch', 'Limestone ridge overlook above a broad cottonwood creek bottom', 'wide', 'S', true, false),
  ('cattle ranch', 'Branding pen dust hanging over corrals in a wide open pasture yard', 'wide', 'S', true, false),
  ('cattle ranch', 'Limestone ridge crest with buzzards riding a thermal overhead', 'medium', 'S', true, true),
  ('cattle ranch', 'Cattle standing in the shallows of a cottonwood-shaded stock pond', 'medium', 'S', true, true),
  ('cattle ranch', 'Cookhouse stone hearth with a cast-iron crane and hanging pot', 'intimate', 'S', false, true),
  ('cattle ranch', 'Open range pasture with longhorns scattered to the horizon', 'wide', 'A', true, false),
  ('cattle ranch', 'Bunch-grass prairie flat stretching beneath a towering cloudbank', 'wide', 'A', true, false),
  ('cattle ranch', 'Three-board cedar fence line running over rolling caliche grade', 'wide', 'A', true, false),
  ('cattle ranch', 'Red clay flats with a windmill tower rising against open sky', 'wide', 'A', true, false),
  ('cattle ranch', 'Barbed-wire fence posts marching across a rolling Great Plains grade', 'wide', 'A', true, false),
  ('cattle ranch', 'Cattle drifting across a wide caliche flat under a pale blue dome', 'wide', 'A', true, false),
  ('cattle ranch', 'Dry creek drainage cutting through open bunch-grass prairie', 'wide', 'A', true, false),
  ('cattle ranch', 'Earthen stock-pond dam crossing a red-clay draw in open pasture', 'wide', 'A', true, false),
  ('cattle ranch', 'Split-rail cedar fence running uphill across a wide limestone ridge', 'wide', 'A', true, false),
  ('cattle ranch', 'Log barn entrance with cedar-post corral fence in front', 'medium', 'A', true, true),
  ('cattle ranch', 'Cedar-post corral gate with rawhide lashing and worn ground beyond', 'medium', 'A', true, true),
  ('cattle ranch', 'Chuckwagon parked beside a cedar-post corral fence', 'medium', 'A', true, true),
  ('cattle ranch', 'Stock tank brimming with water beside a windmill base', 'medium', 'A', true, true),
  ('cattle ranch', 'Branding fire with irons in the coals inside a pole corral', 'medium', 'A', true, true),
  ('cattle ranch', 'Dry creek crossing with a wire gap sagging over the bed', 'medium', 'A', true, true),
  ('cattle ranch', 'Muddy stock-pond bank trampled to bare red clay at the waterline', 'medium', 'A', true, true),
  ('cattle ranch', 'Cookhouse porch with a split-log bench and caliche yard beyond', 'medium', 'A', true, true),
  ('cattle ranch', 'Pole corral rails with cattle pressed flank to flank inside', 'medium', 'A', true, true),
  ('cattle ranch', 'Cottonwood grove over a red-clay creek bank at the tank edge', 'medium', 'A', true, true),
  ('cattle ranch', 'Limestone ridge face with scattered cedar trees above the pasture', 'medium', 'A', true, true),
  ('cattle ranch', 'Pecan tree canopy above a muddy bank at the stock tank', 'medium', 'A', true, true),
  ('cattle ranch', 'Cedar-post corral holding cattle against a dusty caliche yard', 'medium', 'A', true, true),
  ('cattle ranch', 'Windmill base and stock tank beside a cedar-post corral gate', 'medium', 'A', true, true),
  ('cattle ranch', 'Caliche yard between the cookhouse and the log barn', 'medium', 'A', true, true),
  ('cattle ranch', 'Bunch-grass swale with buffalo grass bending toward a cedar draw', 'medium', 'A', true, true),
  ('cattle ranch', 'Cedar brake edge where grassland gives way to dense scrub cedar', 'medium', 'A', true, true),
  ('cattle ranch', 'Open-sided cedar log shed beside the ranch headquarters corral', 'medium', 'A', true, true),
  ('cattle ranch', 'Cookhouse doorway opening onto a caliche yard in the ranch compound', 'intimate', 'A', false, true),
  ('cattle ranch', 'Bunkhouse interior with rope-strung wooden bunks against a log wall', 'intimate', 'A', false, true),
  ('cattle ranch', 'Cedar-post corral interior with churned red clay and a cedar rail', 'intimate', 'A', false, true),
  ('cattle ranch', 'Limestone ridge saddle with cedars on both flanks and pasture falling away', 'medium', 'S', true, true),
  ('cattle ranch', 'Log barn side wall with a cedar-shingled lean-to and worn hitching rail', 'medium', 'A', true, true),
  ('cattle ranch', 'Bunkhouse exterior log wall with a single shuttered window and caliche step', 'medium', 'A', true, true),
  ('cattle ranch', 'Pole corral chute alley with cedar rails worn smooth by livestock', 'medium', 'A', true, true),
  ('cattle ranch', 'Limestone outcropping breaking through buffalo grass on a rolling pasture grade', 'medium', 'A', true, true),
  ('cattle ranch', 'Cedar brake interior where juniper trunks crowd a narrow cattle trail', 'medium', 'A', true, true),
  ('cattle ranch', 'Open range swale where buffalo grass parts around a salt lick post', 'medium', 'A', true, true),
  ('cattle ranch', 'Cookhouse stone chimney rising above a caliche-packed headquarters yard', 'medium', 'A', true, true),
  ('cattle ranch', 'Cattail fringe at the stock-pond edge with muddy shallows beyond', 'medium', 'A', true, true),
  ('cattle ranch', 'Log barn stall with a hay-strewn earthen floor and cedar manger', 'intimate', 'A', false, true),
  ('cattle ranch', 'Dry creek bed limestone ledge with hoof-scored caliche bank beside it', 'intimate', 'A', false, true),
  ('cattle ranch', 'Windmill tower lattice rising above the bunkhouse roofline against open sky', 'medium', 'A', true, true),
  ('celestial realm', 'Retractable bronze-gear roof open to a ringed planet horizon', 'wide', 'S', true, false),
  ('celestial realm', 'Obsidian-inlaid promenade beside a vast star-mirrored shore', 'wide', 'S', true, false),
  ('celestial realm', 'Glass pavilion row on a clifftop above nebula-coloured waterfalls', 'wide', 'S', true, false),
  ('celestial realm', 'Moonstone-columned pavilion over a still star-reflecting lake inlet', 'medium', 'S', true, true),
  ('celestial realm', 'Brass orrery room open at the ceiling to a ringed planet', 'medium', 'S', true, true),
  ('celestial realm', 'Hemispherical limestone observatory drum beneath a galactic-arm sky', 'medium', 'A', true, true),
  ('celestial realm', 'Cantilevered lakeside terrace with polished obsidian star-position inlay', 'medium', 'A', true, true),
  ('celestial realm', 'Moss-edged stone grotto with nebula colours pooled in still water below', 'intimate', 'A', false, true),
  ('collioure france', 'Boramar cove from its promenade with castle flank and café terraces', 'wide', 'S', true, false),
  ('collioure france', 'Notre-Dame-des-Anges broad church terrace above old cemetery wall and open sea', 'wide', 'S', true, false),
  ('collioure france', 'Vieux Collioure rooftop skyline with domed bell tower and castle rising behind', 'wide', 'S', true, false),
  ('collioure france', 'Vineyard hillside terraces with stacked dry-stone walls framing harbor far below', 'wide', 'A', true, false),
  ('collioure france', 'Fort Saint-Elme ridge pine canopy opening onto bay and stacked town below', 'wide', 'A', true, false),
  ('collioure france', 'Iron-railing balcony hung with laundry between coral and sky-blue plaster facades', 'medium', 'A', true, true),
  ('collioure france', 'Steep stepped alley between ochre walls with iron railings in Vieux Collioure', 'medium', 'A', true, true),
  ('collioure france', 'Notre-Dame-des-Anges cemetery wall facing open Mediterranean water', 'medium', 'S', true, true),
  ('collioure france', 'Fort Saint-Elme hexagonal tower base among windswept hillside pines', 'medium', 'S', true, true),
  ('collioure france', 'Boramar café terrace between striped parasols and castle stonework', 'medium', 'S', true, true),
  ('coney island', 'Cyclone and Wonder Wheel flanking the full Luna Park midway below', 'wide', 'S', true, false),
  ('coney island', 'Steeplechase Pier extending over open Atlantic from boardwalk edge', 'wide', 'S', true, false),
  ('coney island', 'Wonder Wheel loading platform with painted gondola cars and spoke frame above', 'medium', 'S', true, true),
  ('coney island', 'Cyclone roller coaster station house beneath the first lift hill trestle', 'medium', 'S', true, true),
  ('coney island', 'Sideshow Row barker platform between two glowing bulb marquee archways', 'medium', 'S', true, true),
  ('coney island', 'Parachute Jump base ring with radial cable anchors and boardwalk planking', 'medium', 'S', true, true),
  ('coney island', 'Riegelmann Boardwalk full length from W. 8th to W. 37th Street', 'wide', 'A', true, false),
  ('coney island', 'Coney Island Beach from lifeguard stand row to Atlantic surf line', 'wide', 'A', true, false),
  ('coney island', 'Nathan''s Famous outdoor counter with yellow-and-red tile facade behind', 'medium', 'A', true, true),
  ('crystal caverns', 'Selenite Blade Gallery receding into prismatic infinity', 'wide', 'S', true, false),
  ('crystal caverns', 'Flowstone Curtain Terraces descending through violet-lit chambers', 'wide', 'S', true, false),
  ('crystal caverns', 'Gypsum Bloom Vault ceiling erupting across the entire nave', 'wide', 'S', true, false),
  ('crystal caverns', 'Mirror Pool Sanctuary reflecting a cathedral of radiant spires', 'wide', 'S', true, false),
  ('crystal caverns', 'Amethyst Geode Grotto split open across the chamber floor', 'wide', 'S', true, false),
  ('crystal caverns', 'The Grand Selenite Nave lined with translucent blade walls', 'wide', 'S', true, false),
  ('crystal caverns', 'Amethyst Geode Corridor glowing between twin cleaved formation walls', 'wide', 'S', true, false),
  ('crystal caverns', 'Flowstone Balcony Rings stacked through the high-vaulted shaft', 'wide', 'S', true, false),
  ('crystal caverns', 'The Still Pool Nave reflecting twin rows of crystal sentinels', 'wide', 'S', true, false),
  ('crystal caverns', 'Selenite Fin Crossroads where four glowing corridors converge', 'wide', 'S', true, false),
  ('crystal caverns', 'Flowstone Mineral River framed by glowing curtain walls on either side', 'wide', 'S', true, false),
  ('crystal caverns', 'Amethyst Geode Alcove split at eye level, glowing from within', 'medium', 'S', true, true),
  ('crystal caverns', 'Crystal Natural Bridge spanning the shallow mirror pool below', 'medium', 'S', true, true),
  ('crystal caverns', 'Flowstone Curtain Grotto recessed behind the translucent mineral veil', 'medium', 'S', true, true),
  ('crystal caverns', 'Gypsum Flower Hollow enclosed by blooms on every curving wall', 'intimate', 'S', false, true),
  ('crystal caverns', 'Mirror Pool Niche enclosed by glowing walls and their reflection below', 'intimate', 'S', false, true),
  ('crystal caverns', 'Quartz Spire Cradle enclosed by three translucent towers at close range', 'intimate', 'S', false, true),
  ('crystal caverns', 'Quartz Spire Halls stretching toward the luminous far wall', 'wide', 'A', true, false),
  ('crystal caverns', 'Tiered Selenite Shelves rising through overlapping white radiance', 'wide', 'A', true, false),
  ('crystal caverns', 'Prismatic Spire Forest filling the domed central hall', 'wide', 'A', true, false),
  ('crystal caverns', 'Crystal Rib Vaults arcing overhead through the cathedral passage', 'wide', 'A', true, false),
  ('crystal caverns', 'Crystalline Plateau where clear towers cluster at every compass point', 'wide', 'A', true, false),
  ('crystal caverns', 'The Radiant Hollow where selenite walls converge at the far arch', 'wide', 'A', true, false),
  ('crystal caverns', 'Quartz Colonnade Promenade stretching through the luminous transit hall', 'wide', 'A', true, false),
  ('crystal caverns', 'Faceted Grotto Basin ringed by translucent violet geode walls', 'wide', 'A', true, false),
  ('crystal caverns', 'Crystal Shelf Terraces stepping down through the luminous lower hall', 'wide', 'A', true, false),
  ('crystal caverns', 'The Pale Spire Lowlands spreading across the illuminated rift floor', 'wide', 'A', true, false),
  ('crystal caverns', 'Prismatic Arch Sequence receding through the translucent passage', 'wide', 'A', true, false),
  ('crystal caverns', 'Selenite Fin Wall scattering overlapping light across the narrow floor', 'medium', 'A', true, true),
  ('crystal caverns', 'Gypsum Bloom Archway framing the passage beyond in white clusters', 'medium', 'A', true, true),
  ('crystal caverns', 'Selenite Curtain Wall sheeting the curved passage alcove', 'medium', 'A', true, true),
  ('crystal caverns', 'Gypsum Flower Apse blooming from the curved overhead nook', 'medium', 'A', true, true),
  ('crystal caverns', 'Quartz Spire Cluster rising from the low shelf into open vault above', 'medium', 'A', true, true),
  ('crystal caverns', 'Mirror Pool Corner reflecting a single luminous geode wall', 'medium', 'A', true, true),
  ('crystal caverns', 'Amethyst Geode Half-Dome opened against the curved chamber wall', 'medium', 'A', true, true),
  ('crystal caverns', 'Crystal Overhang jutting above the flowstone-draped platform below', 'medium', 'A', true, true),
  ('crystal caverns', 'Quartz Spire Threshold where twin formations frame the entry', 'medium', 'A', true, true),
  ('crystal caverns', 'Mirror Pool Platform of flat white mineral beside the still basin', 'medium', 'A', true, true),
  ('crystal caverns', 'Gypsum Bloom Ceiling above the low rectangular antechamber', 'medium', 'A', true, true),
  ('crystal caverns', 'Selenite Blade Gap where two translucent fins nearly touch overhead', 'intimate', 'A', false, true),
  ('crystal caverns', 'Quartz Spire Base where crystal roots spread across the lit floor', 'intimate', 'A', false, true),
  ('crystal caverns', 'Flowstone Curtain Overhang sheltering the narrow mineral ledge below', 'intimate', 'A', false, true),
  ('crystal caverns', 'Mirror Pool Rim where crystal formations crowd the still glowing edge', 'intimate', 'A', false, true),
  ('crystal caverns', 'Selenite Blade Apse where paired fins bow toward each other overhead', 'medium', 'S', true, true),
  ('crystal caverns', 'Quartz Spire Island rising from the shallow luminous basin', 'medium', 'S', true, true),
  ('crystal caverns', 'Amethyst Geode Throne jutting from the curved chamber wall', 'medium', 'A', true, true),
  ('crystal caverns', 'Amethyst Geode Pocket glowing behind a low stone lip', 'intimate', 'A', false, true),
  ('crystal caverns', 'Flowstone Nook where mineral folds cradle a still hollow', 'intimate', 'A', false, true),
  ('dragons keep', 'Lava-tube corridor crystallized along its entire vaulted length', 'wide', 'S', true, false),
  ('dragons keep', 'Spiral dragon-clearance staircase rising through a smoke-blackened mountain shaft', 'wide', 'S', true, false),
  ('dragons keep', 'Fissure floor chamber glowing along every molten seam below', 'wide', 'S', true, false),
  ('dragons keep', 'Magma-lit throne grotto deep in the volcanic core', 'wide', 'A', true, false),
  ('dragons keep', 'Clifftop landing platforms cantilevered over thousand-foot drops', 'wide', 'A', true, false),
  ('dragons keep', 'Great Hall colonnade of carved basalt under smoke-vented vaults', 'wide', 'A', true, false),
  ('dragons keep', 'Obsidian-flagged Great Hall floor pooling in forge-glow', 'medium', 'A', true, true),
  ('dragons keep', 'Copper-scale tessellated recess lining a volcanic core antechamber', 'medium', 'A', true, true),
  ('dragons keep', 'Sulfur-crusted basalt column of impossible scale in the sanctum nave', 'medium', 'A', true, true),
  ('dragons keep', 'Core chamber wall threaded with glowing molten seams floor to ceiling', 'medium', 'A', true, true),
  ('dragons keep', 'Rampart platform edge of charred obsidian above the volcanic gorge', 'medium', 'S', true, true),
  ('dragons keep', 'Forge sanctum arch soaring to soot-blackened keystones above', 'medium', 'A', true, true),
  ('dragons keep', 'Forge sanctum floor pooling with supernatural amber forge-glow', 'medium', 'A', true, true),
  ('dragons keep', 'Dragon-clearance stairwell mouth opening onto a sulfur-crusted landing', 'medium', 'A', true, true),
  ('dragons keep', 'Treasury vault recess crowded with crystallized magma formations', 'medium', 'A', true, true),
  ('dragons keep', 'Blackened battlement fused hard into a natural volcanic spire', 'medium', 'A', true, true),
  ('dragons keep', 'Subterranean forge basin ringed by igneous rock pillars', 'medium', 'A', true, true),
  ('dragons keep', 'Smoke-vent chimney flue rising through a Great Hall ceiling opening', 'medium', 'A', true, true),
  ('dragons keep', 'Charred obsidian throne dais rising from the grotto floor', 'medium', 'A', true, true),
  ('dragons keep', 'Single basalt column carved floor to arch in the sanctum nave', 'medium', 'A', true, true),
  ('dragons keep', 'Forge sanctum wall where superheated air shimmers the carved relief', 'medium', 'A', true, true),
  ('dragons keep', 'Great Hall far end wall haloed in asymmetric forge-glow', 'medium', 'A', true, true),
  ('dragons keep', 'Obsidian-flagged approach to the triple iron treasury door', 'medium', 'A', true, true),
  ('dragons keep', 'Lava-tube branching junction glittering with crystallized mineral crusts', 'medium', 'A', true, true),
  ('dragons keep', 'Lava-tube corridor mouth ringed in sulfur-crusted mineral bloom', 'medium', 'A', true, true),
  ('dragons keep', 'Lava-tube side chamber sealed on three sides by crystallized basalt', 'intimate', 'A', false, true),
  ('dragons keep', 'Crystallized basalt alcove glowing amber from a buried magma seam', 'intimate', 'A', false, true),
  ('egypt', 'Avenue of Sphinxes stretching between Luxor and Karnak temples', 'wide', 'S', true, false),
  ('egypt', 'Deir el-Medina workers'' village nestled in limestone valley bowl', 'wide', 'S', true, false),
  ('egypt', 'Abu Simbel blue Nasser lakeshore and golden desert margin', 'wide', 'S', true, false),
  ('egypt', 'Giza Plateau mortuary causeways descending toward the Nile valley', 'wide', 'S', true, false),
  ('egypt', 'Pyramid of Menkaure rising from rubble field on southern Giza plateau', 'wide', 'S', true, false),
  ('egypt', 'Hatshepsut obelisk of red granite rising above Karnak sanctuary court', 'medium', 'S', true, true),
  ('egypt', 'Abu Simbel interior hypostyle chamber with painted seated deity statues', 'medium', 'S', true, true),
  ('egypt', 'Luxor Temple inner colonnade of Amenhotep III towering papyrus columns', 'medium', 'S', true, true),
  ('egypt', 'Seti I tomb painted astronomical ceiling in the Valley of the Kings', 'medium', 'S', true, true),
  ('egypt', 'Edfu Temple of Horus inner sanctuary naos and granite shrine', 'medium', 'S', true, true),
  ('egypt', 'Great Sphinx causeway limestone pavement leading to Khafre pyramid', 'medium', 'S', true, true),
  ('egypt', 'Ramesseum first pylon wall carved with Battle of Kadesh relief', 'medium', 'S', true, true),
  ('egypt', 'Medinet Habu outer enclosure gate with painted tower battlements', 'medium', 'S', true, true),
  ('egypt', 'Tomb of Nefertari painted antechamber walls glowing lapis and gold', 'intimate', 'S', false, true),
  ('egypt', 'Nile felucca reach between palm-fringed green banks near Aswan', 'wide', 'A', true, false),
  ('egypt', 'Sahara star-duned erg stretching to the flat desert horizon', 'wide', 'A', true, false),
  ('egypt', 'Sandstone cliffs of the Nile corridor above Edfu temple complex', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Music Box Alcove with velvet-lined shelves floor to ceiling', 'wide', 'S', true, false),
  ('enchanted toy shop', 'Clockwork Diorama Wing under a forest of glass domes', 'wide', 'S', true, false),
  ('enchanted toy shop', 'Watchmaker''s Workshop Nook opening onto the main floor', 'wide', 'S', true, false),
  ('enchanted toy shop', 'Divided-Pane Bay Window Alcove flooding the floor with colour', 'wide', 'S', true, false),
  ('enchanted toy shop', 'Clockwork Curiosity Counter Room, lamp-warmed and shadow-deep', 'wide', 'S', true, false),
  ('enchanted toy shop', 'Clockwork Key and Gear Showroom of the main cabinet wing', 'wide', 'S', true, false),
  ('enchanted toy shop', 'Glass-Topped Counter Hall with rear sliding panel doors', 'wide', 'S', true, false),
  ('enchanted toy shop', 'Mezzanine Railed Walkway above amber cabinet glow below', 'wide', 'S', true, false),
  ('enchanted toy shop', 'Automata Cabinet Nave, theatrical lamp shadow and warm gold', 'wide', 'S', true, false),
  ('enchanted toy shop', 'Wind-Up Automata Cabinet Hall, amber-lit nave', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Tin Toy Display Corridor receding into deep shadow', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Pressed Tin Ceiling nave beneath repeating floral tiles', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Nested Doll Pyramid Gallery on the mezzanine level', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Carved Wooden Soldier Frieze corridor of the upper gallery', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Grand Main Floor of the enchanted Victorian toy shop', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Fairy-Tale Illustration Frieze lining the mezzanine walls', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Narrow Wooden Staircase rising to the rope-railed mezzanine', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Velvet-Draped Puppet Backdrop Wall of the stage corner', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Toy Motif Relief Corridor along the carved wooden side wall', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Inlaid Wooden Case Gallery receding into alcove shadow', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Sliding-Panel Glass Counter with clockwork curiosity inside', 'medium', 'A', true, true),
  ('enchanted toy shop', 'Gilded Filigree Cabinet Column of the automata display hall', 'medium', 'A', true, true),
  ('enchanted toy shop', 'Silk-strung marionette figures before miniature proscenium arch', 'medium', 'S', true, true),
  ('enchanted toy shop', 'Velvet-lined alcove shelf of spinning ballerina music boxes', 'medium', 'S', true, true),
  ('enchanted toy shop', 'Wind-up automaton cabinet, key and gear heroes foreground', 'medium', 'S', true, true),
  ('enchanted toy shop', 'Pressed tin ceiling bay above carousel horses posed mid-gallop', 'medium', 'S', true, true),
  ('enchanted toy shop', 'Bay window bench seat, coloured pane light on carousel horse', 'medium', 'S', true, true),
  ('enchanted toy shop', 'Glass dome diorama cluster, amber lamp glow between each globe', 'medium', 'S', true, true),
  ('enchanted toy shop', 'Marionette Stage Corner, tangled strings and painted backdrops', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Victorian toy shop interior, layered shelves receding into shadow', 'wide', 'A', true, false),
  ('enchanted toy shop', 'Watchmaker''s lamp over half-assembled clockwork mechanism tray', 'medium', 'A', true, true),
  ('enchanted toy shop', 'Curved glass display case of wound clockwork curiosities inside', 'medium', 'A', true, true),
  ('enchanted toy shop', 'Tin toy cabinet, warm amber lamp burning against deep shadow', 'medium', 'A', true, true),
  ('enchanted toy shop', 'Mezzanine railing hung with fairy-tale illustration panel frieze', 'medium', 'A', true, true),
  ('enchanted toy shop', 'Narrow wooden staircase landing opening to mezzanine gallery', 'medium', 'A', true, true),
  ('enchanted toy shop', 'Carved wooden soldier nook between two mezzanine pilasters', 'intimate', 'S', false, true),
  ('epic battlefield', 'Zigzag trench turning section with overhead traverse', 'medium', 'S', true, true),
  ('epic battlefield', 'Massed battering ram frame positioned before gate ruin', 'medium', 'S', true, true),
  ('epic battlefield', 'Heavy catapult arm raised and cocked on earthwork platform', 'medium', 'S', true, true),
  ('epic battlefield', 'Fieldwork interior with map table and canvas overhead', 'medium', 'S', true, true),
  ('epic battlefield', 'Cratered no-man''s-land stretching to smoke-hazed horizon', 'wide', 'A', true, false),
  ('epic battlefield', 'Scorched plain with collapsed wagon columns and fallen standards', 'wide', 'A', true, false),
  ('epic battlefield', 'Rampart wall array facing breached outer fortifications', 'wide', 'A', true, false),
  ('epic battlefield', 'Hilltop overlooking entire devastated earthwork plain', 'wide', 'A', true, false),
  ('epic battlefield', 'Suspension bridge spanning full dry gorge width', 'wide', 'A', true, false),
  ('epic battlefield', 'Toppled tower platforms across churned approach ground', 'wide', 'A', true, false),
  ('epic battlefield', 'Dry gorge with abandoned artillery on both banks', 'wide', 'A', true, false),
  ('epic battlefield', 'Large shell crater with fractured timber bracing', 'medium', 'A', true, true),
  ('epic battlefield', 'Angled earthen rampart face in compacted defensive profile', 'medium', 'A', true, true),
  ('epic battlefield', 'Timber palisade posts driven at irregular forward spacing', 'medium', 'A', true, true),
  ('epic battlefield', 'Breach gap in outer stone and earthen wall', 'medium', 'A', true, true),
  ('epic battlefield', 'Forward approach trench cutting toward breached rampart', 'medium', 'A', true, true),
  ('epic battlefield', 'Covered gallery entrance cut into the forward embankment', 'medium', 'A', true, true),
  ('epic battlefield', 'Standing burned-out catapult frame on scorched ground', 'medium', 'A', true, true),
  ('epic battlefield', 'Overturned supply wagon with charred wheel and axle', 'medium', 'A', true, true),
  ('epic battlefield', 'Switchback approach trench cut into ravine slope', 'medium', 'A', true, true),
  ('epic battlefield', 'Dry ravine floor beneath suspended bridge span', 'medium', 'A', true, true),
  ('epic battlefield', 'Earthwork gun emplacement cut into west bank slope', 'medium', 'A', true, true),
  ('epic battlefield', 'Stacked stone fieldwork wall at hilltop perimeter', 'medium', 'A', true, true),
  ('epic battlefield', 'Raised earth observation step behind stone parapet', 'medium', 'A', true, true),
  ('epic battlefield', 'Toppled stone siege tower base on churned earth', 'medium', 'A', true, true),
  ('epic battlefield', 'Shattered wooden walkway planks over sunken gallery', 'medium', 'A', true, true),
  ('epic battlefield', 'Half-toppled timber siege tower scaffold section', 'medium', 'A', true, true),
  ('epic battlefield', 'Smoldering war engine half-buried in black stubble', 'medium', 'S', true, true),
  ('gold rush camp', 'Worked gravel bars and rocker boxes lining rushing creek claim', 'wide', 'S', true, false),
  ('gold rush camp', 'Sluice run descending red-clay hillside cut through pine forest', 'wide', 'S', true, false),
  ('gold rush camp', 'Tailings field of gravel mounds and exposed bedrock channels below ridgeline', 'wide', 'S', true, false),
  ('gold rush camp', 'Eroded gulch walls flanking rows of canvas shelters and oilcloth roofs', 'wide', 'S', true, false),
  ('gold rush camp', 'Canvas Town wall tents spread across pine-shaded prospectors'' flat', 'wide', 'A', true, false),
  ('gold rush camp', 'Plank Storefront Row unpainted lumber shacks along muddy camp lane', 'wide', 'A', true, false),
  ('gold rush camp', 'Ponderosa ridgeline crowning gulch above all camp diggings below', 'wide', 'A', true, false),
  ('gold rush camp', 'Diverted creek channel cutting through disturbed gravel toward sluice head', 'wide', 'A', true, false),
  ('gold rush camp', 'Sugar pine forest framing entire placer camp from high ridgeline', 'wide', 'A', true, false),
  ('gold rush camp', 'Bedrock channel exposed by placer digging across tailings flat', 'wide', 'A', true, false),
  ('gold rush camp', 'Prospector wall tent on split-log floor raised above red-clay ground', 'medium', 'A', true, true),
  ('gold rush camp', 'Assay shed and supply shack sharing corner of muddy plank-fronted lane', 'medium', 'S', true, true),
  ('grand estate', 'Symmetrical rose allée between paired topiary columns and stone urns', 'wide', 'S', true, false),
  ('grand estate', 'Double-return marble staircase beneath central crystal chandelier', 'medium', 'S', true, true),
  ('grand estate', 'Poolside cabana row along mosaic-tiled lagoon surround', 'medium', 'S', true, true),
  ('grand estate', 'Infinity pool terrace stretching toward clipped hedge horizon', 'wide', 'A', true, false),
  ('grand estate', 'Box-hedge parterre centred on carved stone fountain basin', 'medium', 'A', true, true),
  ('grand estate', 'Grand ballroom''s floor-to-ceiling draped windows above parquet floor', 'medium', 'A', true, true),
  ('grand estate', 'Climate-controlled showroom garage lined with gleaming exotic cars', 'medium', 'A', true, true),
  ('grand estate', 'Al-fresco dining pavilion on rear entertaining terrace', 'medium', 'A', true, true),
  ('grand estate', 'Gilded mirror alcove beside inlaid marble foyer floor', 'intimate', 'A', false, true),
  ('haleiwa', 'Haleiwa Beach Park ironwood grove over reef-flat shallows with resting turtles', 'medium', 'S', true, true),
  ('haleiwa', 'Pu''u o Mahuka Heiau platform edge overlooking Waimea Bay far below', 'medium', 'S', true, true),
  ('haleiwa', 'Anahulu Stream paddler launch point below mossy concrete Rainbow Bridge railing', 'medium', 'S', true, true),
  ('haleiwa', 'Haleiwa Small Boat Harbor breakwater arm and open Pacific channel mouth', 'wide', 'A', true, false),
  ('haleiwa', 'Kamehameha Highway main street full storefront row from Rainbow Bridge end', 'wide', 'A', true, false),
  ('haleiwa', 'Anahulu Stream bank beneath overhanging tropical growth below Rainbow Bridge', 'medium', 'A', true, true),
  ('haleiwa', 'Haleiwa Beach Park protected cove shoreline with calm water and ironwood shade', 'medium', 'A', true, true),
  ('haleiwa', 'Haleiwa Ali''i Beach Park volleyball courts, lifeguard tower, and full surf lineup', 'wide', 'S', true, false),
  ('hanalei', 'Hanalei taro valley floor between levee roads under rainbow arc', 'wide', 'S', true, false),
  ('hanalei', 'Kalalau Trail ridge above Hanakoa with layered pali descending to sea', 'wide', 'S', true, false),
  ('hanalei', 'Hanalei River corridor winding through emerald paddies toward distant bay', 'wide', 'S', true, false),
  ('hanalei', 'Na Pali fluted cliffs from Kalalau valley rim with ocean far below', 'wide', 'S', true, false),
  ('hanalei', 'Hanalei Pier end platform over open bay with valley walls surrounding', 'wide', 'S', true, false),
  ('hanalei', 'Waioli meadow clearing framed by mountain amphitheater and old mango canopy', 'wide', 'S', true, false),
  ('hanalei', 'Kee Beach lagoon apron with Makana peak towering above full reef bay', 'wide', 'S', true, false),
  ('hanalei', 'Hanalei Bay paddle channel at river mouth with full ridgeline reflected', 'wide', 'S', true, false),
  ('hanalei', 'Hanakapi''ai stream valley opening above cobble beach to layered palis', 'wide', 'S', true, false),
  ('hanalei', 'Corrugated tin-roofed shave ice stand on Ching Young Village lanai', 'medium', 'S', true, true),
  ('hanalei', 'Kalalau Beach driftwood-edged shore beneath single towering pali wall', 'medium', 'S', true, true),
  ('hanalei', 'Hanalei River bank kayak landing with taro paddies and waterfall ridge behind', 'medium', 'S', true, true),
  ('hanalei', 'Waioli Mission grounds old plantation cottage porch with mountain meadow behind', 'medium', 'S', true, true),
  ('hanalei', 'Kilauea Point lighthouse white tower base with ocean horizon and seabirds overhead', 'medium', 'S', true, true),
  ('hanalei', 'Hanalei Bay inner water from Black Pot Beach Park shore', 'wide', 'A', true, false),
  ('hanalei', 'Waioli Huiia Church front gate between two towering Cook pines', 'medium', 'A', true, true),
  ('key west', 'Duval Street at dusk with lantern-lit balconies and bougainvillea', 'wide', 'S', true, false),
  ('key west', 'Simonton Street royal poinciana canopy over Conch mansion row', 'wide', 'S', true, false),
  ('key west', 'Sloppy Joe''s Bar neon-lit facade with open-air corner entrance', 'medium', 'S', true, true),
  ('key west', 'Key West Historic Seaport fish house with rigging lines and pelicans', 'medium', 'S', true, true),
  ('key west', 'Fleming Street Conch mansion widow''s walk above tropical canopy', 'medium', 'S', true, true),
  ('key west', 'Weathered shrimp boat at mangrove-fringed Historic Seaport quayside', 'medium', 'S', true, true),
  ('key west', 'Conch cottage tin roof and jalousie shutters on coral-rock piers', 'medium', 'A', true, true),
  ('key west', 'Hidden garden courtyard behind wrought-iron gate on Simonton Street', 'medium', 'A', true, true),
  ('laguna beach', 'Forest Avenue open-air gallery entrance with large glass frontage and terracotta urns', 'medium', 'S', true, true),
  ('laguna beach', 'Wood''s Cove concrete bluff staircase opening onto flat sandstone ledge above tidepools', 'medium', 'S', true, true),
  ('laguna beach', 'Aliso Beach broad sandy arc framed by wave-cut sandstone bluffs and surf', 'wide', 'A', true, false),
  ('laguna beach', 'Treasure Island Park clifftop meadow above secluded cove and distant sea stacks', 'wide', 'A', true, false),
  ('laguna beach', 'South Laguna bluff road with whitewashed cottages spilling toward open Pacific', 'wide', 'A', true, false),
  ('laguna beach', 'Canyon Road ascending bend with terraced Mediterranean homes and palm crowns above', 'wide', 'A', true, false),
  ('laguna beach', 'Crescent Bay pocket beach sea cave mouth framed by barnacled granite walls', 'medium', 'A', true, true),
  ('laguna beach', 'Laguna Art Museum blufftop terrace garden above Main Beach cove', 'wide', 'S', true, false),
  ('laguna beach', 'Forest Avenue sidewalk café patio with iron tables beneath bougainvillea-draped pergola', 'medium', 'S', true, true),
  ('lahaina', 'Au''au Channel shoreline seawall with Lanai silhouetted at sunset', 'wide', 'S', true, false),
  ('lahaina', 'Wo Hing Society Museum two-story wood and plaster facade on Front Street', 'medium', 'S', true, true),
  ('lahaina', 'Baldwin Home Museum thick coral stone interior courtyard and whitewashed walls', 'intimate', 'S', false, true),
  ('malibu', 'Zuma Beach golden crescent from Point Dume bluff shoulder', 'wide', 'S', true, false),
  ('malibu', 'Adamson House Moorish tilework courtyard facing Malibu Lagoon', 'medium', 'S', true, true),
  ('malibu', 'Zuma Beach kelp-draped tide pool terrace below headland cliffs', 'medium', 'S', true, true),
  ('malibu', 'El Matador rock arch framing translucent green inshore surge channel', 'medium', 'S', true, true),
  ('malibu', 'Carbon Beach glass-decked stilted houses lining surf edge', 'wide', 'A', true, false),
  ('malibu', 'Malibu Colony narrow sand spit with packed beachfront homes', 'wide', 'A', true, false),
  ('malibu', 'El Matador blufftop above stacked sea stacks and pocket coves', 'wide', 'A', true, false),
  ('malibu', 'Malibu Road bleached board-and-batten cottage facade on sand spit', 'medium', 'A', true, true),
  ('malibu', 'La Piedra Beach stairpath cut into sandstone bluff face', 'medium', 'A', true, true),
  ('mermaid lagoon', 'Giant clamshell half-buried silt shelf', 'medium', 'S', true, true),
  ('mermaid lagoon', 'Pearl grotto mineral stalactite ceiling', 'medium', 'S', true, true),
  ('mermaid lagoon', 'Purple anemone dense-walled inner grotto', 'medium', 'S', true, true),
  ('mermaid lagoon', 'Bioluminescent shallows algae meadow expanse', 'wide', 'A', true, false),
  ('mermaid lagoon', 'Sapphire drop-off teal gradient wall', 'wide', 'A', true, false),
  ('mermaid lagoon', 'White terrace fields stepped cascade formation', 'wide', 'A', true, false),
  ('mermaid lagoon', 'Kelp cathedral vaulted gold-green corridor', 'wide', 'A', true, false),
  ('mermaid lagoon', 'Pearl grottos limestone arch cluster', 'wide', 'A', true, false),
  ('mermaid lagoon', 'Anemone cave mouth purple-lined shoreline', 'wide', 'A', true, false),
  ('mermaid lagoon', 'Calcium terrace rimmed mineral crust pool', 'medium', 'A', true, true),
  ('mermaid lagoon', 'Olive-amber kelp frond curtained archway', 'medium', 'A', true, true),
  ('mermaid lagoon', 'Driftwood platform shell-encrusted water-level deck', 'medium', 'A', true, true),
  ('mermaid lagoon', 'Submerged rope bridge rocky outcrop span', 'medium', 'A', true, true),
  ('monte carlo', 'Fairmont Hotel curved glass facade above swimming pool hairpin', 'wide', 'S', true, false),
  ('monte carlo', 'Monaco Grand Prix harbour-front chicane between pit buildings and sea', 'wide', 'S', true, false),
  ('monte carlo', 'Casino Square limestone Hôtel de Paris colonnade and central plaza', 'wide', 'S', true, false),
  ('monte carlo', 'Port Hercule racing pit-lane straight with belle-époque port buildings', 'wide', 'S', true, false),
  ('monte carlo', 'Port Hercule tender dinghy jetty below stacked hillside apartment terraces', 'wide', 'S', true, false),
  ('monte carlo', 'Casino de Monte-Carlo gilded gaming salon interior with painted ceiling', 'medium', 'S', true, true),
  ('monte carlo', 'Casino de Monte-Carlo grand atrium beneath green copper dome', 'medium', 'S', true, true),
  ('monte carlo', 'Grand Prix tunnel interior tiled white ceramic walls curving ahead', 'medium', 'S', true, true),
  ('monte carlo', 'Monte-Carlo Beach rocky promontory above open Mediterranean water', 'wide', 'A', true, false),
  ('monte carlo', 'Larvotto beach club private sun-deck with polished chrome railings', 'medium', 'A', true, true),
  ('monte carlo', 'Prince''s Palace old-town lane with ochre walls and ornate iron balconies', 'medium', 'A', true, true),
  ('monte carlo', 'Larvotto private beach clubs and white canopied sun-lounger terraces', 'wide', 'A', true, false),
  ('monte carlo', 'Casino de Monte-Carlo supercar forecourt with flower-lined Place du Casino beyond', 'wide', 'S', true, false),
  ('monte carlo', 'Larvotto shoreline poolside bar terrace stretching toward rocky promontory', 'wide', 'S', true, false),
  ('monument valley trail', 'Rain God Mesa broad red plateau edge above open sand basin', 'wide', 'S', true, false),
  ('monument valley trail', 'Narrow wind-scoured gully between Camel Butte base and dune ridge', 'intimate', 'S', false, true),
  ('moon base', 'Hydroponic garden bay inside curved habitat ring module', 'medium', 'S', true, true),
  ('moon base', 'Solar panel grid fields stretching across grey regolith apron', 'wide', 'A', true, false),
  ('myrtle beach', 'Grand Strand''s shell-strewn tide line stretching toward Apache Pier', 'wide', 'S', true, false),
  ('myrtle beach', 'Myrtle Beach State Park weathered boardwalk crossing over sea-oat dunes', 'medium', 'S', true, true),
  ('myrtle beach', 'Ocean Boulevard striped-awning saltwater taffy storefront with sidewalk display', 'medium', 'S', true, true),
  ('myrtle beach', 'screened porch of a butter-yellow raised beach cottage with wicker furniture', 'medium', 'S', true, true),
  ('myrtle beach', 'hibiscus-draped picket fence gate of a coral raised beach cottage', 'medium', 'S', true, true),
  ('myrtle beach', 'mid-pier planking of Apache Pier with green Atlantic swells visible below', 'medium', 'S', true, true),
  ('myrtle beach', 'Boardwalk Americana novelty shop with hand-lettered signs and spinning rack outside', 'medium', 'S', true, true),
  ('myrtle beach', 'mint-green raised cottage staircase with shell wind chimes on Ocean Boulevard', 'medium', 'S', true, true),
  ('myrtle beach', 'old-school soft-serve ice cream stand on a Beachfront Cottage Village corner', 'medium', 'A', true, true),
  ('myrtle beach', 'tackle shop entrance at the base of a long wooden Atlantic pier', 'medium', 'A', true, true),
  ('myrtle beach', 'striped beach umbrella row anchored in sand just above the tide line', 'medium', 'A', true, true),
  ('myrtle beach', 'wind-twisted palmetto at the end of a bougainvillea-draped cottage lane', 'medium', 'A', true, true),
  ('northern lights glacier', 'Grímsvötn caldera rim across Vatnajökull ice plateau', 'wide', 'S', true, false),
  ('northern lights glacier', 'Skeiðarárjökull outlet tongue spreading onto sandur flats', 'wide', 'S', true, false),
  ('northern lights glacier', 'Kronebreen tidewater calving face above Kongsfjorden', 'wide', 'S', true, false),
  ('northern lights glacier', 'Russell Glacier crevasse field under green aurora sky', 'wide', 'S', true, false),
  ('northern lights glacier', 'Nigardsbreen tongue descending into Jostedalen valley', 'wide', 'S', true, false),
  ('northern lights glacier', 'Kangerlussuaq meltwater channels braided across inland plain', 'wide', 'S', true, false),
  ('northern lights glacier', 'Kongsvegen medial moraine striping Svalbard glacier basin', 'wide', 'S', true, false),
  ('northern lights glacier', 'Öræfajökull summit dome corniced edge against deep-blue sky', 'medium', 'S', true, true),
  ('northern lights glacier', 'Jökulsárlón tabular iceberg grounded on submerged moraine ridge', 'medium', 'S', true, true),
  ('northern lights glacier', 'Jökulsárlón proglacial outwash plain edged by stranded seracs', 'medium', 'S', true, true),
  ('northern lights glacier', 'Kronebreen pressure ridge crest at tidewater margin', 'medium', 'S', true, true),
  ('northern lights glacier', 'Russell Glacier serac tower split by deep crevasse', 'medium', 'S', true, true),
  ('northern lights glacier', 'Kangerlussuaq meltwater channel undercut bank above blue pool', 'medium', 'S', true, true),
  ('northern lights glacier', 'Briksdalsbreen arm descending between rock walls above meltwater pool', 'medium', 'S', true, true),
  ('northern lights glacier', 'Jostedalsbreen exposed nunatak ridgeline emerging from ice dome', 'medium', 'S', true, true),
  ('northern lights glacier', 'Brooks Range aurora-reflecting meltwater pond edged by sastrugi', 'medium', 'S', true, true),
  ('northern lights glacier', 'Skeiðarárjökull outlet tongue pressure ridges under violet aurora', 'medium', 'S', true, true),
  ('northern lights glacier', 'Vatnajökull ice cap surface crevasse field at glacier divide', 'medium', 'S', true, true),
  ('northern lights glacier', 'Jökulsárlón floating iceberg cluster lit by green aurora', 'medium', 'S', true, true),
  ('northern lights glacier', 'Breiðamerkurjökull medial moraine debris band crossing glacier face', 'medium', 'S', true, true),
  ('northern lights glacier', 'Svalbard sastrugi wind field under polar twilight on Ny-Ålesund ice', 'medium', 'S', true, true),
  ('northern lights glacier', 'Briksdalsbreen meltwater pool with floating ice blocks under aurora', 'medium', 'S', true, true),
  ('northern lights glacier', 'Kangerlussuaq inland serac alley between tilted ice columns', 'medium', 'S', true, true),
  ('northern lights glacier', 'Brooks Range sastrugi field with aurora columns overhead', 'medium', 'S', true, true),
  ('northern lights glacier', 'Ny-Ålesund ice field serac row under deep-blue twilight', 'medium', 'S', true, true),
  ('northern lights glacier', 'Grímsvötn ice rim crevasse interior glowing with green aurora light', 'intimate', 'S', false, true),
  ('northern lights glacier', 'Russell Glacier narrow slot crevasse between blue compressed ice walls', 'intimate', 'S', false, true),
  ('outer banks', 'Cape Hatteras Lighthouse keeper''s quarters compound amid wind-flattened dune scrub', 'wide', 'S', true, false),
  ('outer banks', 'Jockey''s Ridge megadune crest overlooking Roanoke Sound and Kill Devil Hills rooftops', 'wide', 'S', true, false),
  ('outer banks', 'Shackleford Banks shell-ribbed beach with Cape Lookout Lighthouse on far horizon', 'wide', 'S', true, false),
  ('outer banks', 'Cape Hatteras Lighthouse base with diagonal black-and-white brick spiral rising above', 'medium', 'S', true, true),
  ('outer banks', 'Corolla cedar-shake cottage row with salt-bleached trim and beach-access boardwalk', 'medium', 'S', true, true),
  ('outer banks', 'Pea Island refuge dike footpath between brackish impoundment and Atlantic dunes', 'medium', 'S', true, true),
  ('outer banks', 'Buxton sea oat meadow on wind-scoured dune face with ocean beyond', 'medium', 'S', true, true),
  ('outer banks', 'Buxton beach Atlantic strand curving toward Cape Point shoals', 'wide', 'A', true, false),
  ('outer banks', 'Hatteras Harbour fish house on pilings above inlet channel water', 'medium', 'A', true, true),
  ('outer banks', 'Ocracoke Village white picket-fenced cottage with climbing roses on cedar boards', 'medium', 'A', true, true),
  ('outer banks', 'Corolla beach-access boardwalk cutting through tall oceanfront dune ridge', 'medium', 'A', true, true),
  ('outer banks', 'Hatteras Village sound-side pelican flat with low marsh grass and open sky', 'medium', 'A', true, true),
  ('outer banks', 'Jockey''s Ridge windward dune slope with ridgeline and sky above', 'medium', 'A', true, true),
  ('outer banks', 'Ocracoke Silver Lake wooden dock with skiffs and hanging nets', 'medium', 'S', true, true),
  ('outlaw hideout', 'Canyon rim lookout perch above the full hideout below', 'wide', 'S', true, false),
  ('outlaw hideout', 'Fire pit ringed with stones, saddles propped on boulders behind', 'medium', 'S', true, true),
  ('outlaw hideout', 'Red-rock fortress canyon opening onto scrub desert floor', 'wide', 'A', true, false),
  ('outlaw hideout', 'Horse tether line strung wide between two scrub junipers', 'wide', 'A', true, false),
  ('outlaw hideout', 'Rock overhang sheltering full spread of outlaw tent camp', 'wide', 'A', true, false),
  ('outlaw hideout', 'Shadow-carved sandstone alcove deep within the red cliff face', 'medium', 'A', true, true),
  ('outlaw hideout', 'Hawk-nested sandstone ledge jutting from rust-streaked cliff face', 'medium', 'A', true, true),
  ('outlaw hideout', 'Weathered canvas tent under rock overhang, lantern glow leaking through seams', 'medium', 'S', true, true),
  ('outlaw hideout', 'Dry-stacked stone wall sealing canyon alcove, gun belts hanging from timber peg', 'medium', 'S', true, true),
  ('overgrown wonders', 'Palace ballroom floor warped into flowering turf hills', 'medium', 'S', true, true),
  ('palm beach florida', 'The Breakers oceanfront lawn stretching toward Italian Renaissance towers', 'wide', 'S', true, false),
  ('palm beach florida', 'Royal Palm Way coral-stone garden walls and gilded estate gates receding into distance', 'wide', 'S', true, false),
  ('palm beach florida', 'Via Parigi covered walkway with Moorish arched ceiling and terracotta tile floor', 'medium', 'S', true, true),
  ('palm beach florida', 'The Breakers arched colonnade with garden urns and oceanfront light beyond', 'medium', 'S', true, true),
  ('palm beach florida', 'Worth Avenue Via Mizner fountain court with Spanish-tile basin and carved limestone surround', 'medium', 'S', true, true),
  ('palm beach florida', 'Palm Beach Bath and Tennis Club beach-side striped awning pavilion facing Atlantic', 'medium', 'S', true, true),
  ('palm beach florida', 'Mizner-designed estate open loggia with paired arches, terracotta tile, and garden below', 'medium', 'S', true, true),
  ('palm beach florida', 'Historic estate oolite limestone gate lodge with arched doorway on South Ocean Boulevard', 'medium', 'S', true, true),
  ('palm beach florida', 'The Breakers Italian Renaissance tower base with arched window surrounds and stone quoins', 'medium', 'S', true, true),
  ('palm beach florida', 'Lake Worth Lagoon sunset promenade with bougainvillea-covered seawall and moored sailboats', 'medium', 'S', true, true),
  ('palm beach florida', 'Breakers resort east garden parterre with clipped topiaries and Italian Renaissance arcade', 'medium', 'S', true, true),
  ('palm beach florida', 'Addison Mizner shopfront with Venetian Gothic window and hanging lantern on Worth Avenue', 'medium', 'S', true, true),
  ('palm beach florida', 'Via Parigi open courtyard with potted orange trees and ivory stucco arched surround', 'medium', 'S', true, true),
  ('palm beach florida', 'Oceanfront estate terrace with oolite limestone balustrade and turquoise Atlantic beyond', 'medium', 'S', true, true),
  ('palm beach florida', 'Royal Poinciana Way Mediterranean-revival corner arcade with glazed-tile spandrel panels', 'medium', 'S', true, true),
  ('palm beach florida', 'Breakers resort palm court inner garden with tiered fountain and surrounding arched loggias', 'medium', 'S', true, true),
  ('palm beach florida', 'Via Mizner arched niche with hand-painted Spanish tile mural and hanging lantern', 'intimate', 'S', false, true),
  ('palm beach florida', 'Worth Avenue courtyard corner with wrought-iron café table, tile floor, and potted bougainvillea', 'intimate', 'S', false, true),
  ('palm beach florida', 'Atlantic Beach Club row with cabana pavilions and turquoise surf beyond', 'wide', 'A', true, false),
  ('palm beach florida', 'Coconut Row royal-palm canopy arching over coral-stone estate boundary walls', 'wide', 'A', true, false),
  ('palm beach florida', 'Historic estate district boulevard flanked by Mediterranean Revival mansions and royal palms', 'wide', 'A', true, false),
  ('palm beach florida', 'Sugar-white Atlantic beach extending beneath royal palms and estate rooftops', 'wide', 'A', true, false),
  ('palm beach florida', 'Gilded ironwork estate gate on Coconut Row with coral-stone pilasters', 'medium', 'A', true, true),
  ('palm beach florida', 'The Breakers resort garden with arched trellis, clipped hedges, and terracotta pots', 'medium', 'A', true, true),
  ('palm beach florida', 'Oolite limestone estate wall with terracotta tile coping and royal palm beyond', 'medium', 'A', true, true),
  ('palm beach florida', 'Four Arts Society garden courtyard with Spanish-tile fountain and tropical plantings', 'medium', 'A', true, true),
  ('palm beach florida', 'Royal Poinciana Plaza courtyard with tiled fountain and Mediterranean arcade surround', 'medium', 'A', true, true),
  ('palm beach florida', 'Lake Trail royal-palm grove opening onto Lake Worth Lagoon waterfront', 'medium', 'A', true, true),
  ('palm beach florida', 'Manicured bougainvillea hedge flanking coral-stone entry path on Royal Palm Way', 'medium', 'A', true, true),
  ('palm beach florida', 'Mediterranean Revival estate cloister garden with terracotta barrel-tile roof and central palm', 'medium', 'A', true, true),
  ('palm beach florida', 'Historic estate district royal-palm boulevard gate entrance with Mediterranean Revival pillars', 'medium', 'A', true, true),
  ('prehistoric', 'Titanosaur herd crossing braided river channels across sunlit alluvial flood plain', 'wide', 'S', true, false),
  ('prehistoric', 'Pterosaur flock wheeling above oxbow lake bend, forested highland ridge smoking beyond', 'wide', 'S', true, false),
  ('prehistoric', 'Ancient delta margin at dusk, cypress-like canopy silhouettes framing amber-tinted shallows, crocodilian wakes spreading', 'wide', 'S', true, false),
  ('prehistoric', 'Araucaria highland plateau under rolling mist, waterfall gorge cutting layered sedimentary cliff face toward valley floor', 'wide', 'S', true, false),
  ('prehistoric', 'Pterosaur roosting colony on araucaria crown, wingspans framed against humid thunderhead rising behind highland canopy', 'medium', 'S', true, true),
  ('prehistoric', 'Marine reptile silhouette just below shallow inland sea surface, dappled amber light refracting across its back', 'medium', 'S', true, true),
  ('prehistoric', 'Giant sequoia root buttress wall rising from moss-carpeted highland floor, mist pooling between trunk bases', 'medium', 'A', true, true),
  ('prehistoric', 'Swamp margin driftwood logjam, amber-tinted water parting around submerged trunks, crocodilian snout breaking surface', 'medium', 'A', true, true),
  ('prehistoric', 'River delta channel bank, cypress-like roots arching into amber shallows, spore cloud drifting across reflected sky', 'medium', 'A', true, true),
  ('prehistoric', 'Sauropod track depression filled with warm mineral water, fresh claw impressions sharp in surrounding grey mud', 'medium', 'A', true, true),
  ('prehistoric', 'Early bird canopy roost inside mist-draped sequoia crown, layered highland valley visible far below through fog', 'medium', 'A', true, true),
  ('prehistoric', 'Exposed sedimentary cliff face beside waterfall gorge, horizontal ochre and crimson strata bands glistening wet', 'medium', 'S', true, true),
  ('prehistoric', 'Cooling black lava flow edge beside mineral-stained hot spring, steam rising where flow meets turquoise water', 'medium', 'S', true, true),
  ('prehistoric', 'Theropod pack gathered at carcass site on open floodplain, braided river channels glinting behind scattered bones', 'medium', 'S', true, true),
  ('prehistoric', 'Ammonite-dense tidal shallows, spiral shells half-buried in warm grey silt at knee depth', 'intimate', 'S', false, true),
  ('private jet', 'Exterior ramp at blue hour with cabin light spilling through oval windows', 'wide', 'S', true, false),
  ('private jet', 'Full interior from bedroom bulkhead across lounge to forward galley', 'wide', 'S', true, false),
  ('private jet', 'Private terminal apron with jet centered under golden hour sky', 'wide', 'A', true, false),
  ('private jet', 'Polished livery reflecting runway lights on empty executive ramp', 'wide', 'A', true, false),
  ('private jet', 'Twin-engine fuselage silhouette against amber and violet horizon', 'wide', 'A', true, false),
  ('private jet', 'Jet taxiing alone across vast darkened tarmac under floodlights', 'wide', 'A', true, false),
  ('private jet', 'Full fuselage profile with wing shadow stretched across wet tarmac', 'wide', 'A', true, false),
  ('private jet', 'Runway threshold with jet poised for departure under cloud-streaked sky', 'wide', 'A', true, false),
  ('private jet', 'Tarmac at night with jet under portable floodlight towers', 'wide', 'A', true, false),
  ('private jet', 'Forward bulkhead entertainment panel flanked by gold-trimmed cabinetry', 'medium', 'A', true, true),
  ('private jet', 'Deployed airstairs rising to open cabin door in golden hour light', 'medium', 'A', true, true),
  ('private jet', 'Cockpit threshold doorway framed by cream leather forward bulkhead', 'medium', 'A', true, true),
  ('private jet', 'Single swivel seat facing oval window at cruise altitude', 'medium', 'A', true, true),
  ('private jet', 'Bedroom suite cashmere throw on made bed under curved cabin ceiling', 'medium', 'A', true, true),
  ('private jet', 'Facing pair of cream leather swivel seats across narrow aisle', 'medium', 'A', true, true),
  ('private jet', 'Forward lounge divan corner seat beneath softly glowing side-panel lamp', 'medium', 'A', true, true),
  ('private jet', 'Cocktail table set with crystal flutes in forward lounge under ambient mood lighting', 'medium', 'A', true, true),
  ('private jet', 'Sleek white fuselage on sun-drenched private apron with deployed stairs', 'wide', 'A', true, false),
  ('private jet', 'Galley nook with espresso machine and stacked convection ovens', 'medium', 'A', true, true),
  ('private jet', 'Narrow plush-carpeted aisle between cream leather swivel seat bases', 'intimate', 'A', false, true),
  ('private jet', 'Bedroom window shade half-raised over cashmere pillow and curved cabin wall', 'intimate', 'A', false, true),
  ('private jet', 'Aft bulkhead niche with folded cashmere throw on cream leather bench', 'intimate', 'A', false, true),
  ('red carpet', 'grand theater marquee soaring above gilded entrance canopy', 'wide', 'S', true, false),
  ('red carpet', 'paparazzi scaffold towers flanking the full red carpet strip', 'wide', 'S', true, false),
  ('red carpet', 'gala ballroom floor shimmering beneath a constellation of chandeliers', 'wide', 'S', true, false),
  ('red carpet', 'theater entrance plaza blazing with camera flashes and crowd', 'wide', 'S', true, false),
  ('red carpet', 'illuminated marquee reflected across rain-slicked forecourt pavement', 'wide', 'S', true, false),
  ('red carpet', 'theater gilded entrance colonnade under blazing premiere lighting rigs', 'wide', 'S', true, false),
  ('red carpet', 'black-tie ballroom with golden statuettes lining every pedestal', 'wide', 'S', true, false),
  ('red carpet', 'limousine court with brushed steel and glass venue canopy above', 'wide', 'S', true, false),
  ('red carpet', 'grand theater exterior with red carpet spilling down front steps', 'wide', 'S', true, false),
  ('red carpet', 'premiere carpet end at theater door with rope and doorman', 'medium', 'S', true, true),
  ('red carpet', 'limousine rear door open at forecourt carpet edge', 'medium', 'S', true, true),
  ('red carpet', 'step-and-repeat wall corner where carpet and press zone meet', 'medium', 'S', true, true),
  ('red carpet', 'limousine interior doorway framing the forecourt flashbulb storm', 'intimate', 'S', false, true),
  ('red carpet', 'crimson carpet runner stretching to gilded theater doors', 'wide', 'A', true, false),
  ('red carpet', 'limousine arrival forecourt under blaze of flashbulbs', 'wide', 'A', true, false),
  ('red carpet', 'step-and-repeat press wall spanning full premiere backdrop', 'wide', 'A', true, false),
  ('red carpet', 'fan pen barriers lining both sides of the full carpet', 'wide', 'A', true, false),
  ('red carpet', 'velvet rope corridor receding toward illuminated theater doors', 'wide', 'A', true, false),
  ('red carpet', 'press riser platforms stretching along the full carpet length', 'wide', 'A', true, false),
  ('red carpet', 'ballroom entrance archway opening onto glittering reception floor', 'wide', 'A', true, false),
  ('red carpet', 'sweeping carpet approach framed by velvet rope and crowd barriers', 'wide', 'A', true, false),
  ('red carpet', 'gilded theater entrance doors framed by white-gloved doormen', 'medium', 'A', true, true),
  ('red carpet', 'theater entrance canopy in brushed steel and glass panels', 'medium', 'A', true, true),
  ('red carpet', 'press wall base where stars stand for paparazzi portraits', 'medium', 'A', true, true),
  ('red carpet', 'ballroom entrance foyer with polished marble floor and chandelier', 'medium', 'A', true, true),
  ('red carpet', 'ballroom stage podium with golden award statuette displayed', 'medium', 'A', true, true),
  ('red carpet', 'gala ballroom bar counter gleaming with champagne flute rows', 'medium', 'A', true, true),
  ('red carpet', 'theater entrance foyer glimpsed through open gilded front doors', 'medium', 'A', true, true),
  ('red carpet', 'ballroom mezzanine railing overlooking the glittering reception floor', 'medium', 'A', true, true),
  ('red carpet', 'ballroom polished parquet floor reflecting chandelier light above', 'intimate', 'A', false, true),
  ('red carpet', 'ballroom champagne tower beneath a single blazing chandelier drop', 'medium', 'S', true, true),
  ('red carpet', 'ballroom mirror corner reflecting chandelier and sequined crowd', 'intimate', 'S', false, true),
  ('red carpet', 'press riser platform edge overlooking the crimson carpet below', 'medium', 'A', true, true),
  ('red carpet', 'limousine forecourt lane marked by chrome crowd barrier stanchions', 'medium', 'A', true, true),
  ('red carpet', 'theater gilded side door framed by ornamental pilasters', 'medium', 'A', true, true),
  ('red carpet', 'ballroom golden pedestal alcove between two floor mirrors', 'medium', 'A', true, true),
  ('red carpet', 'carpet arrival strip beneath a blaze of overhead lighting rigs', 'medium', 'A', true, true),
  ('red carpet', 'fan pen front barrier where programs wave above the rail', 'medium', 'A', true, true),
  ('red carpet', 'ballroom mezzanine corner alcove with velvet upholstered bench', 'intimate', 'A', false, true),
  ('red carpet', 'carpet midpoint velvet rope gap where guests are admitted', 'intimate', 'A', false, true),
  ('sahara dunes', 'Erg Chech barchan crescent chain receding across open sand sea', 'wide', 'S', true, false),
  ('sahara dunes', 'Erg Chigaga compound star dunes under raking low sun Morocco', 'wide', 'S', true, false),
  ('sahara dunes', 'Ubari Sand Sea golden slip-face walls filling the entire horizon', 'wide', 'S', true, false),
  ('sahara dunes', 'Erg Chech sinuous linear ridges crossing empty Algerian sand sea', 'wide', 'S', true, false),
  ('sahara dunes', 'Grand Erg Oriental pale gold dune chains dissolving into haze Tunisia', 'wide', 'S', true, false),
  ('sahara dunes', 'Erg Chebbi star dune arms radiating across amber Merzouga erg floor', 'wide', 'S', true, false),
  ('sahara dunes', 'Erg of Bilma deep sienna dune massif above bleached inter-dune flat', 'wide', 'S', true, false),
  ('sahara dunes', 'Erg of Bilma razor-edged crestline of monumental rust dune up close', 'medium', 'S', true, true),
  ('sahara dunes', 'Ubari Sand Sea hard-shadowed slip-face wall rising from corridor floor', 'medium', 'S', true, true),
  ('sahara dunes', 'Erg Chigaga compound star dune horn curving against empty sky Morocco', 'medium', 'S', true, true),
  ('sahara dunes', 'Grand Erg Oriental single crescent dune brow against ochre erg behind', 'medium', 'S', true, true),
  ('sahara dunes', 'Erg Chebbi deep burnt-sienna slip-face with hard crestline shadow above', 'medium', 'S', true, true),
  ('sahara dunes', 'Erg Chigaga star dune saddle between two peaked horn summits Morocco', 'medium', 'S', true, true),
  ('sahara dunes', 'Erg Chebbi wind-rippled stoss slope rising to sharp amber crestline', 'medium', 'S', true, true),
  ('sahara dunes', 'Erg Chebbi hollow between two star dune arms in deep orange shadow', 'intimate', 'S', false, true),
  ('sahara dunes', 'Ubari Sand Sea golden slip-face staircase descending into empty inter-dune plain', 'wide', 'S', true, false),
  ('sahara dunes', 'Erg Chebbi apricot erg floor spreading beneath crimson star dune summit', 'wide', 'S', true, false),
  ('santa cruz california', 'Casino arcade building''s Spanish red-tile roofline above the seaside midway games strip', 'wide', 'S', true, false),
  ('santa cruz california', 'Municipal Wharf bait shacks clustered mid-pier above green Pacific swells', 'medium', 'S', true, true),
  ('santa cruz california', 'Beach Hill jasmine-hung spindle-rail porch with ornate gingerbread trim and ocean glimpse', 'medium', 'S', true, true),
  ('santa monica', 'Palisades Park palm-lined promenade above golden sand beach', 'wide', 'S', true, false),
  ('santa monica', 'Santa Monica Pier roller coaster steel lattice above open Pacific', 'wide', 'S', true, false),
  ('santa monica', 'Pacific Park roller coaster loading platform cantilevered over water', 'medium', 'S', true, true),
  ('santa monica', 'Santa Monica Pier bait shop weathered facade above green surf', 'medium', 'S', true, true),
  ('santa monica', 'Pacific Park Ferris wheel gondola level with pier planking below', 'medium', 'S', true, true),
  ('santa monica', 'Lit Ferris wheel reflection on black ocean water from pier end', 'medium', 'S', true, true),
  ('santa monica', 'Santa Monica Pier underside steel frame above breaking surf', 'medium', 'S', true, true),
  ('santa monica', 'End-of-Route-66 sign mounted on pier railing above the Pacific', 'medium', 'S', true, true),
  ('santa monica', 'Santa Monica State Beach volleyball courts and lifeguard towers', 'wide', 'A', true, false),
  ('santa monica', 'Ocean Avenue pastel bungalow row beneath leaning coastal palms', 'wide', 'A', true, false),
  ('santa monica', 'Santa Monica State Beach wide shoreline at the foot of the bluffs', 'wide', 'A', true, false),
  ('santa monica', 'Beach sand below the bluffs with pier silhouetted in hazy light', 'wide', 'A', true, false),
  ('santa monica', 'Ocean Park neighbourhood cottage gardens and Mission Revival facades', 'wide', 'A', true, false),
  ('santa monica', 'Bluff-top bike path along Ocean Avenue with palm row and sea beyond', 'wide', 'A', true, false),
  ('santa monica', 'Lifeguard tower on Santa Monica State Beach wide sand foreground', 'medium', 'A', true, true),
  ('santa monica', 'Beach volleyball net and sand court beneath a pale hazy sky', 'medium', 'A', true, true),
  ('santa monica', 'Third Street Promenade Spanish Revival shopfront with outdoor terrace', 'medium', 'A', true, true),
  ('santa monica', 'Main Street café with open windows and flower-hung awning', 'medium', 'A', true, true),
  ('santa monica', 'Sidewalk café terrace on Ocean Avenue shaded by tall coastal palms', 'medium', 'A', true, true),
  ('santa monica', 'Bougainvillea-draped cottage garden gate on Main Street', 'medium', 'A', true, true),
  ('santa monica', 'Ocean Park boutique storefront beneath painted wood awning', 'medium', 'A', true, true),
  ('santa monica', 'Palisades Park rose garden terrace with ocean bluff beyond', 'medium', 'A', true, true),
  ('santa monica', 'Pier end platform railing with open Pacific horizon ahead', 'medium', 'A', true, true),
  ('santa monica', 'Ocean Avenue sidewalk with Craftsman fence and hibiscus hedge', 'medium', 'A', true, true),
  ('santa monica', 'Bait shop interior counter beside a small pier-side window above waves', 'intimate', 'A', false, true),
  ('santa monica', 'Looff Hippodrome carousel building hand-painted folk-art panel facade', 'medium', 'S', true, true),
  ('santa monica', 'Pier deck planking between arcade building columns above green water', 'intimate', 'S', false, true),
  ('santa monica', 'Main Street Ocean Park Craftsman storefront beneath bougainvillea-draped eaves', 'medium', 'A', true, true),
  ('santa monica', 'Palisades Park wooden bench alcove framed by two leaning Canary Island palms', 'intimate', 'A', false, true),
  ('sky penthouse', 'Heated stone infinity terrace above Midtown''s full north-south skyscraper corridor', 'wide', 'S', true, false),
  ('sky penthouse', 'Cantilevered rooftop deck spanning full arc above Hudson Yards glass towers', 'wide', 'S', true, false),
  ('sky penthouse', 'Rooftop terrace encircling brushed-steel mechanical core above Financial District', 'wide', 'S', true, false),
  ('sky penthouse', 'Frameless glass curtain wall corner above Flatiron Building prow roofline', 'medium', 'S', true, true),
  ('sky penthouse', 'Brass-fitted sky bar counter facing Columbus Circle roundabout below', 'medium', 'S', true, true),
  ('sky penthouse', 'Elevator lobby foyer with sculpture framing One57 tower facade beyond', 'medium', 'S', true, true),
  ('sky penthouse', 'Double-height glass pavilion interior above Rockefeller Center rooftop channel', 'medium', 'S', true, true),
  ('sky penthouse', 'Low marble counter nook pressed against frameless Billionaires'' Row glass', 'intimate', 'A', false, true),
  ('sky penthouse', 'Mezzanine gallery art niche above double-height living pavilion interior', 'intimate', 'A', false, true),
  ('sky penthouse', 'Master suite brushed-steel headboard wall between two glazed city-light corners', 'intimate', 'S', false, true),
  ('south beach miami', 'Lummus Park open lawn stretching toward the turquoise Atlantic horizon', 'wide', 'A', true, false),
  ('south beach miami', 'South Pointe Park grassy bluff overlooking turquoise Government Cut channel', 'wide', 'S', true, false),
  ('st ives cornwall', 'Porthmeor Beach from Tate St Ives curved facade to western cliffs', 'wide', 'S', true, false),
  ('st ives cornwall', 'The Island grassy plateau with harbour and Porthmeor either side', 'wide', 'S', true, false),
  ('st ives cornwall', 'Porthgwidden Beach painted beach huts against The Island headland', 'wide', 'S', true, false),
  ('st ives cornwall', 'Barbara Hepworth Sculpture Garden full enclosure with bronze forms among palms', 'wide', 'S', true, false),
  ('st ives cornwall', 'Tate St Ives curved white concrete entrance facade above beach steps', 'medium', 'S', true, true),
  ('st ives cornwall', 'Downalong cobbled lane with central drainage gulley and flower boxes', 'medium', 'S', true, true),
  ('st ives cornwall', 'Barbara Hepworth Sculpture Garden enclosed corner with rough-cut stone among ferns', 'intimate', 'S', false, true),
  ('st ives cornwall', 'Porthminster Beach wide crescent from eastern slipway to pier', 'wide', 'A', true, false),
  ('st ives cornwall', 'Barnoon Hill terraced cottages descending toward Porthmeor surf', 'wide', 'A', true, false),
  ('st ives cornwall', 'St Ives Harbour quayside with lobster pots and stacked crab creels', 'wide', 'A', true, false),
  ('st ives cornwall', 'Wharf Road quayside with fishing luggers and granite town behind', 'wide', 'A', true, false),
  ('st ives cornwall', 'Harbour granite steps with iron mooring rings and tidal weed', 'medium', 'A', true, true),
  ('st ives cornwall', 'Barbara Hepworth Sculpture Garden stone wall with single bronze form', 'medium', 'A', true, true),
  ('st ives cornwall', 'Porthminster Beach curving shoreline with St Ives rooftops and harbour pier beyond', 'wide', 'S', true, false),
  ('the hamptons', 'Topping Rose House Bridgehampton grounds with farmland horizon beyond privet', 'wide', 'S', true, false),
  ('the hamptons', 'Old Halsey House Southampton gardens with weathered cedar shingle facade', 'medium', 'S', true, true),
  ('the hamptons', 'Sag Harbor Custom House Federal-style doorway and brick garden path', 'medium', 'S', true, true),
  ('the hamptons', 'Cooper''s Beach Southampton white dune corridor flanked by tall beach grass', 'medium', 'S', true, true),
  ('the hamptons', 'Sag Harbor Main Street historic whaling-era commercial block with widow''s-walk rooflines', 'medium', 'S', true, true),
  ('the hamptons', 'Bridgehampton farm-stand lane with hydrangea borders and cedar-shingled barn', 'medium', 'S', true, true),
  ('the hamptons', 'Jobs Lane Southampton Village boutique storefronts and elm-shaded street', 'wide', 'A', true, false),
  ('the hamptons', 'Bridgehampton Common open greensward with surrounding historic village buildings', 'wide', 'A', true, false)
) AS v(location_key, spot_text, spot_kind, quality_tier, pure_scene_eligible, character_eligible)
WHERE NOT EXISTS (
  SELECT 1 FROM public.location_iconic_spots s WHERE s.location_key = v.location_key AND s.spot_text = v.spot_text
);
