import re
import unittest

import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="capp"
)
cursor = db.cursor()
cursor2 = db.cursor()
uid1 = '509652db-483c-4328-85b1-120573723b3a'
uid2 = '8161216d-c1c8-4d01-b21a-ba1f559d29e9'


class DBTest(unittest.TestCase):


    # @unittest.skip('dont run')
    def test_benchmark(self):
        try:
            # create 10 servers
            for i in range(0, 10):
                cursor.callproc(
                    "create_server", [uid1, "new server"]
                )
                for result in cursor.stored_results():
                    fetch = result.fetchall()
                    sid = fetch[0][0]
                    # cid = fetch[0][3]
                    # create 10 groups
                    for j in range(0, 10):
                        cursor.execute(
                            f"SELECT create_group('{uid1}', {sid}, 'new group')"
                        )
                        gid = cursor.fetchall()[0][0]
                        # create 10 channels in each group
                        for k in range(0, 10):
                            cursor.execute(
                                f"SELECT create_channel('{uid1}', {sid}, {gid}, 'text', 'new channel')"
                            )
                            cid = cursor.fetchall()[0][0]
                            # create 10 messages in each channel
                            for ll in range(0, 10):
                                cursor.callproc(
                                    "send_message", [uid1, sid, cid, 'message']
                                )
                                for result1 in cursor.stored_results():
                                    result1.fetchall()
                                    pass
            db.commit()
            db.close()
            self.assertGreater(1, 0)
        except mysql.connector.Error as err:
            print(err)
            self.assertFalse(True)
        pass

    @unittest.skip("working test")
    def test_server_creation(self):
        try:
            cursor.callproc(
                "create_server", [uid1, "new server"]
            )
            cursor.callproc(
                "get_user_servers_data", [uid1]
            )
            db.commit()
            db.close()
            result = cursor.stored_results().__next__().fetchall()
            self.assertGreater(len(result), 0)
        except mysql.connector.Error as err:
            print(err)
            self.assertFalse(True)

    @unittest.skip("working test")
    def test_group_creation(self):
        try:
            cursor.callproc(
                "create_server", [uid1, "new server"]
            )
            server_id = cursor.stored_results().__next__().fetchall()[0][0]
            cursor.execute(
                f"SELECT create_group('{uid1}', {server_id}, 'new group')"
            )
            result = cursor.fetchall()
            db.commit()
            db.close()
            self.assertGreater(result[0][0], 0)
        except mysql.connector.Error as err:
            print(err)
            self.assertFalse(True)

    @unittest.skip("working test")
    def test_channel_creation(self):
        try:
            cursor.callproc(
                "create_server", [uid1, "new server"]
            )
            server_id = cursor.stored_results().__next__().fetchall()[0][0]
            cursor.execute(
                f"SELECT * FROM `groups` WHERE server_id = {server_id}"
            )
            gid1 = ''
            gid2 = ''
            for group in cursor.fetchall():
                if group[2] == 'Text channels':
                    gid1 = group[0]
                if group[2] == 'Voice channels':
                    gid2 = group[0]
            cursor.execute(
                f"SELECT create_channel('{uid1}', {server_id}, {gid1}, 'text', 'new text channel')"
            )
            text_channel = cursor.fetchall()
            cursor.execute(
                f"SELECT create_channel('{uid1}', {server_id}, {gid2}, 'voice', 'new voice channel')"
            )
            voice_channel = cursor.fetchall()
            db.commit()
            db.close()
            self.assertGreater(text_channel[0][0], 0)
            self.assertGreater(voice_channel[0][0], 0)
        except mysql.connector.Error as err:
            print(err)
            self.assertFalse(True)

    @unittest.skip("working test")
    def test_invitation_creation(self):
        try:
            cursor.callproc(
                "create_server", [uid1, "new server"]
            )
            server_id = cursor.stored_results().__next__().fetchall()[0][0]
            cursor.execute(
                f"SELECT create_invitation('{uid1}', {server_id})"
            )
            invitation = cursor.fetchall()
            db.commit()
            db.close()
            self.assertIsNotNone(
                re.fullmatch(r"[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}", invitation[0][0]))
        except mysql.connector.Error as err:
            print(err)
            self.assertFalse(True)

    @unittest.skip("working test")
    def test_join_server(self):
        try:
            cursor.callproc(
                "create_server", [uid1, "new server"]
            )
            server_id = cursor.stored_results().__next__().fetchall()[0][0]
            cursor.execute(
                f"SELECT create_invitation('{uid1}', {server_id})"
            )
            invitation = cursor.fetchall()
            cursor.callproc(
                "join_server", [uid2, invitation[0][0]]
            )

            db.commit()
            db.close()
            self.assertGreater(len(next(cursor.stored_results()).fetchall()), 0)
        except mysql.connector.Error as err:
            print(err)
            self.assertFalse(True)


if __name__ == '__main__':
    unittest.main()
